-- {-# LANGUAGE DataKinds #-}
-- {-# LANGUAGE NoImplicitPrelude #-}
-- {-# LANGUAGE TemplateHaskell #-}
-- {-# LANGUAGE ScopedTypeVariables #-}
-- {-# LANGUAGE MultiParamTypeClasses #-}
-- {-# LANGUAGE DerivingStrategies  #-}
-- {-# LANGUAGE OverloadedStrings #-}
-- {-# LANGUAGE TypeApplications #-}
-- {-# LANGUAGE DeriveGeneric #-}
-- {-# LANGUAGE DeriveAnyClass #-}
-- {-# OPTIONS_GHC -Wno-missing-export-lists #-}

-- module RewardGeneration.RewardGeneration where

-- import Plutus.V2.Ledger.Api      (BuiltinData, Validator, mkValidatorScript, ScriptContext, unValidatorScript, BuiltinByteString, POSIXTime, ValidatorHash, Datum(..), scriptContextTxInfo, txInfoOutputs, txOutDatum, ScriptContext, DatumHash, PubKeyHash)
-- import Plutus.V2.Ledger.Contexts (findDatum, TxInfo(..), ScriptContext(..))
-- import PlutusTx                 (compile, toBuiltinData, unsafeFromBuiltinData, unstableMakeIsData, fromBuiltinData)
-- import PlutusTx.Prelude         (traceIfFalse, (==), error, Either(Left), Either(Right), Either, Bool(False), Bool(True), Maybe(Nothing), (.), (&&), (>=), pure, (-), traceError, trace, (<=), toBuiltin)
-- import Prelude                  (IO, FilePath, writeFile, show, Bool, Integer, print, (++), String, ($), putStrLn, undefined, (>>), Maybe(Just), Show, any, not, mempty, Eq, (+))
-- import qualified Data.ByteString.Lazy as LBS
-- import qualified Data.ByteString.Short as SBS
-- import System.Directory (createDirectoryIfMissing)
-- import System.FilePath (takeDirectory)
-- import Cardano.Api
-- import Codec.Serialise (serialise)
-- import Cardano.Api.Shelley (PlutusScript (..), writeFileTextEnvelope, displayError)
-- import qualified Plutus.V2.Ledger.Api
-- import qualified Plutus.Script.Utils.V2.Typed.Scripts as Scripts
-- import  Plutus.Script.Utils.V2.Typed.Scripts 
-- import Data.Aeson (decodeFileStrict')
-- import GHC.Generics (Generic)


-- data TransactionType = RewardGeneration
--     deriving (Show, Eq)

-- PlutusTx.unstableMakeIsData ''TransactionType

-- -- Define LoyaltyTransaction data type
-- data LoyaltyTransaction = LoyaltyTransaction
--     { txType         :: TransactionType
--     , user           :: PubKeyHash
--     , amount         :: Integer
--     , existingBalance:: Integer
--     , timestamp      :: POSIXTime
--     } deriving (Show)

-- PlutusTx.unstableMakeIsData ''LoyaltyTransaction

-- -- Validate Transaction Function
-- validateTransaction :: LoyaltyTransaction -> ScriptContext -> Bool
-- validateTransaction tx ctx =
--     case txType tx of
--         RewardGeneration -> validateRewardGeneration tx ctx

-- -- Reward Generation: Store Reward Details
-- storeRewardDetails :: LoyaltyTransaction -> Integer
-- storeRewardDetails tx =
--     let rewardValue = amount tx
--         updatedValue = rewardValue + existingBalance tx
--     in updatedValue

-- -- Validate Reward Generation
-- validateRewardGeneration :: LoyaltyTransaction -> ScriptContext -> Bool
-- validateRewardGeneration tx ctx =
--     let info = scriptContextTxInfo ctx
--     in traceIfFalse "Amount must be non-negative" (amount tx >= 0)


-- {-# INLINABLE typedGenerationValidator #-}
-- typedGenerationValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
-- typedGenerationValidator datum redeemer context =
--   case (PlutusTx.fromBuiltinData datum :: Maybe LoyaltyTransaction, 
--       PlutusTx.fromBuiltinData context :: Maybe ScriptContext) of
--     (Just tx, Just ctx) -> 
--         if validateTransaction tx ctx
--         then
--             let updatedValue = storeRewardDetails tx  
--             in ()  
--         else
--             traceError "Validation failed"
--     _ -> traceError "Invalid input data"




-- -- Create the untyped validator script
-- validator :: Validator
-- validator = mkValidatorScript $$(PlutusTx.compile [|| typedGenerationValidator ||])

-- writePlutusScript :: FilePath -> Validator -> IO () 
-- writePlutusScript file validator = do 
--     -- let script = PlutusScriptSerialised . SBS.toShort . LBS.toStrict $ serialise validator 
--     createDirectoryIfMissing True (takeDirectory file)
--     result <- writeFileTextEnvelope @(PlutusScript PlutusScriptV2) file Nothing $
--         PlutusScriptSerialised . SBS.toShort . LBS.toStrict . serialise $ Plutus.V2.Ledger.Api.unValidatorScript
--         validator  
--     case result of 
--         Left err -> print $ displayError err 
--         Right () -> putStrLn "Successfully wrote Plutus script to file."

-- writeScript :: IO ()
-- writeScript = writePlutusScript "Generation/Generation.plutus" validator



-- {-# LANGUAGE DataKinds #-}
-- {-# LANGUAGE NoImplicitPrelude #-}
-- {-# LANGUAGE TemplateHaskell #-}
-- {-# LANGUAGE ScopedTypeVariables #-}
-- {-# LANGUAGE MultiParamTypeClasses #-}
-- {-# LANGUAGE DerivingStrategies  #-}
-- {-# LANGUAGE OverloadedStrings #-}
-- {-# LANGUAGE TypeApplications #-}
-- {-# LANGUAGE DeriveGeneric #-}
-- {-# LANGUAGE DeriveAnyClass #-}
-- {-# OPTIONS_GHC -Wno-missing-export-lists #-}
-- {-# OPTIONS_GHC -Wno-unused-imports #-}
-- {-# OPTIONS_GHC -Wno-orphans #-}
-- {-# OPTIONS_GHC -Wno-missing-deriving-strategies #-}
-- {-# OPTIONS_GHC -Wno-unused-matches #-}
-- {-# OPTIONS_GHC -Wno-name-shadowing #-}

-- module RewardGeneration.RewardGeneration where

-- import Plutus.V2.Ledger.Api
--     ( BuiltinData, Validator, mkValidatorScript, ScriptContext,
--       POSIXTime(..), ValidatorHash, Datum(..), scriptContextTxInfo,
--       txInfoOutputs, txOutDatum, DatumHash, PubKeyHash(..) )

-- import Plutus.V2.Ledger.Contexts (findDatum, TxInfo(..), ScriptContext(..))
-- import PlutusTx
--     ( compile, toBuiltinData, unsafeFromBuiltinData, unstableMakeIsData,
--       fromBuiltinData )
-- import PlutusTx.Prelude
--     ( traceIfFalse, (==), error, Either(Left), Either(Right),
--       Bool(False), Bool(True), Maybe(Nothing), (.), (&&), (>=),
--       pure, (-), traceError, trace, (<=), toBuiltin )
-- import Prelude
--     ( return, fail, round, IO, FilePath, writeFile, show, Bool, Integer, print, (++),
--       String, ($), putStrLn, undefined, (>>), Maybe(Just), Show,
--       any, not, mempty, Eq, (+) )

-- import qualified Data.ByteString.Lazy as LBS
-- import qualified Data.ByteString.Short as SBS
-- import System.Directory (createDirectoryIfMissing)
-- import System.FilePath (takeDirectory)
-- import Cardano.Api
-- import Codec.Serialise (serialise)
-- import Cardano.Api.Shelley (PlutusScript (..), writeFileTextEnvelope, displayError)
-- import qualified Plutus.V2.Ledger.Api
-- import qualified Plutus.Script.Utils.V2.Typed.Scripts as Scripts
-- import Plutus.Script.Utils.V2.Typed.Scripts
-- import Data.Aeson
--     ( decodeFileStrict',
--       encode,
--       ToJSON,
--       FromJSON,
--       withScientific,
--       withText )
-- import qualified Data.Aeson as Aeson
-- import GHC.Generics (Generic)
-- import System.IO.Unsafe (unsafePerformIO)
-- import Control.Applicative (pure)
-- import qualified PlutusTx.Builtins as Builtins
-- import qualified Data.Text.Encoding as Text
-- import qualified Data.ByteString as BS
-- import qualified Data.ByteString.Base16 as Base16

-- -- Define JSON instances for POSIXTime
-- instance ToJSON POSIXTime where
--     toJSON (POSIXTime t) = Aeson.toJSON t

-- instance FromJSON POSIXTime where
--     parseJSON = withScientific "POSIXTime" (return . POSIXTime . round)

-- -- Define JSON instances for TransactionType
-- data TransactionType = RewardGeneration
--     deriving (Show, Eq, Generic)

-- instance ToJSON TransactionType where
--     toJSON RewardGeneration = Aeson.String "RewardGeneration"

-- instance FromJSON TransactionType where
--     parseJSON (Aeson.String "RewardGeneration") = return RewardGeneration
--     parseJSON _ = fail "Invalid TransactionType"

-- -- Define JSON instances for PubKeyHash
-- instance ToJSON PubKeyHash where
--     toJSON (PubKeyHash pkh) = Aeson.String $ Text.decodeUtf8 $ Base16.encode (Builtins.fromBuiltin pkh)

-- instance FromJSON PubKeyHash where
--     parseJSON = withText "PubKeyHash" (Control.Applicative.pure . PubKeyHash . Builtins.toBuiltin . Text.encodeUtf8)

-- data LoyaltyTransaction = LoyaltyTransaction
--     { txType         :: TransactionType
--     , user           :: PubKeyHash
--     , amount         :: Integer
--     , existingBalance:: Integer
--     , timestamp      :: POSIXTime
--     } deriving (Show, Generic)

-- instance ToJSON LoyaltyTransaction
-- instance FromJSON LoyaltyTransaction

-- PlutusTx.unstableMakeIsData ''TransactionType
-- PlutusTx.unstableMakeIsData ''LoyaltyTransaction

-- -- Store Reward Details
-- storeRewardDetails :: LoyaltyTransaction -> LoyaltyTransaction
-- storeRewardDetails tx =
--     let updatedBalance = amount tx + existingBalance tx
--     in tx { existingBalance = updatedBalance }

-- -- Read JSON file and process the transaction
-- processTransaction :: FilePath -> IO ()
-- processTransaction inputFile = do
--     -- Read the input datum.json
--     result <- decodeFileStrict' inputFile :: IO (Maybe LoyaltyTransaction)
--     case result of
--         Just tx -> do
--             -- Update the balance
--             let updatedTx = storeRewardDetails tx
--             -- Write the updated transaction to out.json
--             writeUpdatedTransaction "src/RewardGeneration/out.json" updatedTx
--         Nothing -> putStrLn "Failed to parse the datum file."

-- validateTransaction :: LoyaltyTransaction -> ScriptContext -> Bool
-- validateTransaction tx ctx =
--     case txType tx of
--         RewardGeneration -> validateRewardGeneration tx ctx

-- -- Validate Reward Generation
-- validateRewardGeneration :: LoyaltyTransaction -> ScriptContext -> Bool
-- validateRewardGeneration tx ctx =
--     traceIfFalse "Amount must be non-negative" (amount tx >= 0)

-- {-# INLINABLE typedGenerationValidator #-}
-- typedGenerationValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
-- typedGenerationValidator datum _ context =
--   case (PlutusTx.unsafeFromBuiltinData datum :: Maybe LoyaltyTransaction,
--         PlutusTx.unsafeFromBuiltinData context :: Maybe ScriptContext) of
--     (Just tx, Just ctx) ->
--         trace "Decoded successfully" $
--         if validateTransaction tx ctx
--         then trace "Transaction validated and updated" () -- Simulate writing output in trace
--         else traceError "Validation failed"
--     _ -> traceError "Invalid input data"

-- writeUpdatedTransaction :: FilePath -> LoyaltyTransaction -> IO ()
-- writeUpdatedTransaction file tx = do
--     let jsonData = encode tx
--     createDirectoryIfMissing True (takeDirectory file)
--     LBS.writeFile file jsonData
--     putStrLn "Updated transaction details saved successfully."

-- -- Convert to Plutus script
-- writePlutusScript :: FilePath -> Validator -> IO ()
-- writePlutusScript file validator = do
--     createDirectoryIfMissing True (takeDirectory file)
--     let script = PlutusScriptSerialised . SBS.toShort . LBS.toStrict . serialise $ Plutus.V2.Ledger.Api.unValidatorScript validator
--     result <- writeFileTextEnvelope @(PlutusScript PlutusScriptV2) file Nothing script
--     case result of
--         Left err -> print $ displayError err
--         Right () -> putStrLn "Successfully wrote Plutus script to file."

-- -- Validator function to be written to the Plutus script
-- validator :: Validator
-- validator = mkValidatorScript $$(PlutusTx.compile [|| typedGenerationValidator ||])

-- -- Generate the .plutus script file
-- writeScript :: IO ()
-- writeScript = writePlutusScript "rewardGeneration/RewardGeneration.plutus" validator


-- main :: IO ()
-- main = do
--     -- Call processTransaction to handle the update
--     processTransaction "src/RewardGeneration/datum.json"










{-# LANGUAGE DataKinds #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE DerivingStrategies  #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# OPTIONS_GHC -Wno-missing-export-lists #-}
{-# OPTIONS_GHC -Wno-unused-imports #-}
{-# OPTIONS_GHC -Wno-orphans #-}
{-# OPTIONS_GHC -Wno-missing-deriving-strategies #-}
{-# OPTIONS_GHC -Wno-unused-matches #-}
{-# OPTIONS_GHC -Wno-name-shadowing #-}

module RewardGeneration.RewardGeneration where

import Plutus.V2.Ledger.Api
    ( BuiltinData, Validator, mkValidatorScript, ScriptContext,
      POSIXTime(..), ValidatorHash, Datum(..), scriptContextTxInfo,
      txInfoOutputs, txOutDatum, DatumHash, PubKeyHash(..) )

import Plutus.V2.Ledger.Contexts (findDatum, TxInfo(..), ScriptContext(..))
import PlutusTx
    ( compile, toBuiltinData, unsafeFromBuiltinData, unstableMakeIsData,
      fromBuiltinData )
import PlutusTx.Prelude
    ( traceIfFalse, (==), error, Either(Left), Either(Right),
      Bool(False), Bool(True), Maybe(Nothing), (.), (&&), (>=),
      pure, (-), traceError, trace, (<=), toBuiltin )
import Prelude
    ( return, fail, round, IO, FilePath, writeFile, show, Bool, Integer, print, (++),
      String, ($), putStrLn, undefined, (>>), Maybe(Just), Show,
      any, not, mempty, Eq, (+) )

import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import System.Directory (createDirectoryIfMissing)
import System.FilePath (takeDirectory)
import Cardano.Api
import Codec.Serialise (serialise)
import Cardano.Api.Shelley (PlutusScript (..), writeFileTextEnvelope, displayError)
import qualified Plutus.V2.Ledger.Api
import qualified Plutus.Script.Utils.V2.Typed.Scripts as Scripts
import Plutus.Script.Utils.V2.Typed.Scripts
import Data.Aeson
    ( decodeFileStrict',
      encode,
      ToJSON,
      FromJSON,
      withScientific,
      withText )
import qualified Data.Aeson as Aeson
import GHC.Generics (Generic)
import System.IO.Unsafe (unsafePerformIO)
import Control.Applicative (pure)
import qualified PlutusTx.Builtins as Builtins
import qualified Data.Text.Encoding as Text
import qualified Data.ByteString as BS
import qualified Data.ByteString.Base16 as Base16

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
    { amount         :: Integer
    , existingBalance:: Integer
    , timestamp      :: POSIXTime
    } deriving (Show, Generic)

instance ToJSON LoyaltyTransaction
instance FromJSON LoyaltyTransaction

PlutusTx.unstableMakeIsData ''LoyaltyTransaction

-- Store Reward Details
storeRewardDetails :: LoyaltyTransaction -> LoyaltyTransaction
storeRewardDetails tx =
    let updatedBalance = amount tx + existingBalance tx
    in tx { existingBalance = updatedBalance }

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
typedGenerationValidator datum _ _ =  -- Ignore redeemer and context
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
validator = mkValidatorScript $$(PlutusTx.compile [|| typedGenerationValidator ||])

-- Generate the .plutus script file
writeScript :: IO ()
writeScript = writePlutusScript "rewardGeneration/RewardGeneration.plutus" validator

main :: IO ()
main = do
    -- Call processTransaction to handle the update
    processTransaction "src/RewardGeneration/datum.json"
