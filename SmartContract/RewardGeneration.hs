{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# OPTIONS_GHC -Wno-missing-deriving-strategies #-}
{-# OPTIONS_GHC -Wno-missing-export-lists #-}
{-# OPTIONS_GHC -Wno-name-shadowing #-}
{-# OPTIONS_GHC -Wno-orphans #-}
{-# OPTIONS_GHC -Wno-unused-imports #-}
{-# OPTIONS_GHC -Wno-unused-matches #-}

module RewardGeneration.RewardGeneration where

import Cardano.Api
import Cardano.Api.Shelley (PlutusScript (..), displayError, writeFileTextEnvelope)
import Codec.Serialise (serialise)
import Control.Applicative (pure)
import Data.Aeson
  ( FromJSON,
    ToJSON,
    decodeFileStrict',
    encode,
    withScientific,
    withText,
  )
import qualified Data.Aeson as Aeson
import qualified Data.ByteString as BS
import qualified Data.ByteString.Base16 as Base16
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import qualified Data.Text.Encoding as Text
import GHC.Generics (Generic)
import Plutus.Script.Utils.V2.Typed.Scripts
import qualified Plutus.Script.Utils.V2.Typed.Scripts as Scripts
import Plutus.V2.Ledger.Api
  ( BuiltinData,
    Datum (..),
    DatumHash,
    POSIXTime (..),
    PubKeyHash (..),
    ScriptContext,
    Validator,
    ValidatorHash,
    mkValidatorScript,
    scriptContextTxInfo,
    txInfoOutputs,
    txOutDatum,
  )
import qualified Plutus.V2.Ledger.Api
import Plutus.V2.Ledger.Contexts (ScriptContext (..), TxInfo (..), findDatum)
import PlutusTx
  ( compile,
    fromBuiltinData,
    toBuiltinData,
    unsafeFromBuiltinData,
    unstableMakeIsData,
  )
import qualified PlutusTx.Builtins as Builtins
import PlutusTx.Prelude
  ( Bool (False, True),
    Either (Left, Right),
    Maybe (Nothing),
    error,
    pure,
    toBuiltin,
    trace,
    traceError,
    traceIfFalse,
    (&&),
    (-),
    (.),
    (<=),
    (==),
    (>=),
  )
import System.Directory (createDirectoryIfMissing)
import System.FilePath (takeDirectory)
import System.IO.Unsafe (unsafePerformIO)
import Prelude
  ( Bool,
    Eq,
    FilePath,
    IO,
    Integer,
    Maybe (Just),
    Show,
    String,
    any,
    fail,
    mempty,
    not,
    print,
    putStrLn,
    return,
    round,
    show,
    undefined,
    writeFile,
    ($),
    (+),
    (++),
    (>>),
  )

-- Define JSON instances for POSIXTime
instance ToJSON POSIXTime where
  toJSON (POSIXTime t) = Aeson.toJSON t

instance FromJSON POSIXTime where
  parseJSON = withScientific "POSIXTime" (return . POSIXTime . round)

-- Define JSON instances for PubKeyHash
instance ToJSON PubKeyHash where
  toJSON (PubKeyHash pkh) = Aeson.String $ Text.decodeUtf8 $ Base16.encode (Builtins.fromBuiltin pkh)

instance FromJSON PubKeyHash where
  parseJSON = withText "PubKeyHash" (Control.Applicative.pure . PubKeyHash . Builtins.toBuiltin . Text.encodeUtf8)

-- LoyaltyTransaction without txType
data LoyaltyTransaction = LoyaltyTransaction
  { amount :: Integer,
    existingBalance :: Integer,
    timestamp :: POSIXTime
  }
  deriving (Show, Generic)

instance ToJSON LoyaltyTransaction

instance FromJSON LoyaltyTransaction

PlutusTx.unstableMakeIsData ''LoyaltyTransaction

-- Store Reward Details
storeRewardDetails :: LoyaltyTransaction -> LoyaltyTransaction
storeRewardDetails tx =
  let updatedBalance = amount tx + existingBalance tx
   in tx {existingBalance = updatedBalance}

-- Read JSON file and process the transaction
processTransaction :: FilePath -> IO ()
processTransaction inputFile = do
  -- Read the input datum.json
  result <- decodeFileStrict' inputFile :: IO (Maybe LoyaltyTransaction)
  case result of
    Just tx -> do
      -- Update the balance
      let updatedTx = storeRewardDetails tx
      -- Write the updated transaction to out.json
      writeUpdatedTransaction "src/RewardGeneration/out.json" updatedTx
    Nothing -> putStrLn "Failed to parse the datum file."

-- validateTransaction :: LoyaltyTransaction -> ScriptContext -> Bool
-- validateTransaction tx _ = validateRewardGeneration tx

validateTransaction :: LoyaltyTransaction -> Bool
validateTransaction tx = amount tx >= 0

-- Validate Reward Generation
validateRewardGeneration :: LoyaltyTransaction -> Bool
validateRewardGeneration tx =
  traceIfFalse "Amount must be non-negative" (amount tx >= 0)

-- {-# INLINABLE typedGenerationValidator #-}
-- typedGenerationValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
-- typedGenerationValidator datum _ context =
--   case (PlutusTx.unsafeFromBuiltinData datum :: Maybe LoyaltyTransaction,
--         PlutusTx.unsafeFromBuiltinData context :: Maybe ScriptContext) of
--     (Just tx, Just ctx) ->
--         trace "Decoded successfully" $
--         if validateTransaction tx ctx
--         then trace "Transaction validated and updated" ()
--         else traceError "Validation failed"
--     _ -> traceError "Invalid input data"

typedGenerationValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
typedGenerationValidator datum _ _ =
  -- Ignore redeemer and context
  case PlutusTx.unsafeFromBuiltinData datum of
    tx@(LoyaltyTransaction amt bal ts) ->
      if amount tx >= 0
        then ()
        else traceError "Negative amount"
    _ -> traceError "Invalid datum structure"

writeUpdatedTransaction :: FilePath -> LoyaltyTransaction -> IO ()
writeUpdatedTransaction file tx = do
  let jsonData = encode tx
  createDirectoryIfMissing True (takeDirectory file)
  LBS.writeFile file jsonData
  putStrLn "Updated transaction details saved successfully."

-- Convert to Plutus script
writePlutusScript :: FilePath -> Validator -> IO ()
writePlutusScript file validator = do
  createDirectoryIfMissing True (takeDirectory file)
  let script = PlutusScriptSerialised . SBS.toShort . LBS.toStrict . serialise $ Plutus.V2.Ledger.Api.unValidatorScript validator
  result <- writeFileTextEnvelope @(PlutusScript PlutusScriptV2) file Nothing script
  case result of
    Left err -> print $ displayError err
    Right () -> putStrLn "Successfully wrote Plutus script to file."

-- Validator function to be written to the Plutus script
validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [||typedGenerationValidator||])

-- Generate the .plutus script file
writeScript :: IO ()
writeScript = writePlutusScript "rewardGeneration/RewardGeneration.plutus" validator

main :: IO ()
main = do
  -- Call processTransaction to handle the update
  processTransaction "src/RewardGeneration/datum.json"
