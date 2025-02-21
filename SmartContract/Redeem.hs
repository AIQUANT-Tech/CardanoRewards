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
-- module Reward.Redeem where
-- import Plutus.V2.Ledger.Api      (BuiltinData, Validator, mkValidatorScript, ScriptContext, unValidatorScript, BuiltinByteString, POSIXTime, ValidatorHash, Datum(..), scriptContextTxInfo, txInfoOutputs, txOutDatum, ScriptContext, DatumHash)
-- import Plutus.V2.Ledger.Contexts (findDatum, TxInfo(..), ScriptContext(..))
-- import PlutusTx                 (compile, toBuiltinData, unsafeFromBuiltinData, unstableMakeIsData, fromBuiltinData)
-- import PlutusTx.Prelude         (traceIfFalse, (==), error, Either(Left), Either(Right), Either, Bool(False), Bool(True), Maybe(Nothing), (.), (&&), (>=), pure, (-), traceError, trace, (<=), toBuiltin)
-- import Prelude                  (IO, FilePath, writeFile, show, Bool, Integer, print, (++), String, ($), putStrLn, undefined, (>>), Maybe(Just), Show, any, not, mempty)
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
-- import qualified PlutusTx.AssocMap as AssocMap
-- import Test.Tasty                (defaultMain, testGroup, TestTree)
-- import Test.Tasty.HUnit           (assertBool, testCase)
-- data RedeemRequest = RedeemRequest
--     { userId         :: BuiltinByteString
--     , redeemReward  :: Integer
--     , referenceId    :: BuiltinByteString
--     , requiredReward :: Integer
--     , value          :: Integer
--     , timestamp      :: POSIXTime
--     }
-- PlutusTx.unstableMakeIsData ''RedeemRequest
-- -- Data type for User State
-- data UserState = UserState
--     { uUserId       :: BuiltinByteString
--     , rewardBalance :: Integer
--     }
-- PlutusTx.unstableMakeIsData ''UserState
-- -- Validator Logic
-- {-# INLINABLE mkRedeemValidator #-}
-- mkRedeemValidator :: UserState -> RedeemRequest -> ScriptContext -> Bool
-- mkRedeemValidator userState redeemReq ctx =
--     let
--         -- Get the transaction info from the context
--         info = scriptContextTxInfo ctx
--         sufficientBalance = redeemReward redeemReq <= rewardBalance userState
--         rewardMatch = redeemReward redeemReq <= requiredReward redeemReq
--         updatedReward = rewardBalance userState - redeemReward redeemReq
--         -- Generate the updated UserState with the new rewardBalance
--         updatedUserState = UserState (uUserId userState) updatedReward
--         -- isUpdatedStatePresent = any (\o -> case txOutDatum o of
--         --     Plutus.V2.Ledger.Api.OutputDatum (Plutus.V2.Ledger.Api.Datum d) -> case PlutusTx.fromBuiltinData d of
--         --         Just (UserState _ rewardBalance) -> rewardBalance == updatedReward
--         --         _ -> False
--         --     _ -> False
--         --     ) (txInfoOutputs info)
--     in
--         -- All conditions must be true for the transaction to be valid
--         traceIfFalse "Insufficient balance" sufficientBalance &&
--         traceIfFalse "Reward mismatch" rewardMatch
--         -- traceIfFalse "Updated reward not found" isUpdatedStatePresent
-- {-# INLINABLE typedRedeemValidator #-}
-- typedRedeemValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
-- typedRedeemValidator datum redeemer context =
--   case (PlutusTx.fromBuiltinData datum, PlutusTx.fromBuiltinData redeemer, PlutusTx.fromBuiltinData context) of
--     (Just userState, Just redeemReq, Just ctx) ->
--         if mkRedeemValidator userState redeemReq ctx
--         then ()
--         else traceError "Validation failed"
--     (Nothing, _, _) -> traceError "Failed to decode datum."
--     (_, Nothing, _) -> traceError "Failed to decode redeemer."
--     (_, _, Nothing) -> traceError "Failed to decode context."
-- -- Create the untyped validator script
-- validator :: Validator
-- validator = mkValidatorScript $$(PlutusTx.compile [|| typedRedeemValidator ||])
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
-- writeScript = writePlutusScript "Reward/Redeem.plutus" validator
-- -- | Test data
-- testUserState :: UserState
-- testUserState = UserState
--     { uUserId       = "user123"
--     , rewardBalance = 100
--     }
-- testRedeemRequest :: RedeemRequest
-- testRedeemRequest = RedeemRequest
--     { userId         = "user123"
--     , redeemReward   = 50
--     , referenceId    = "txn456"
--     , requiredReward = 50
--     , value          = 10
--     , timestamp      = 1680000000
--     }
-- mockScriptContext :: ScriptContext
-- mockScriptContext = ScriptContext
--     { scriptContextTxInfo = TxInfo
--         { txInfoOutputs = []
--         , txInfoInputs = []
--         , txInfoValidRange = undefined
--         , txInfoSignatories = []
--         , txInfoMint = mempty
--         , txInfoId = undefined
--         , txInfoData = AssocMap.empty  -- ✅ Correctly use an empty Map
--         , txInfoReferenceInputs = []
--         }
--     , scriptContextPurpose = undefined
--     }
-- -- | Test cases
-- testRedeemValidator :: TestTree
-- testRedeemValidator = testGroup "Redeem Validator Tests"
--     [ testCase "Successful redemption" $
--         assertBool "Validator should pass for valid request"
--         (mkRedeemValidator testUserState testRedeemRequest mockScriptContext)
--     , testCase "Fail: Insufficient balance" $
--         let badState = testUserState { rewardBalance = 20 }
--         in assertBool "Validator should fail when balance is insufficient"
--            (not $ mkRedeemValidator badState testRedeemRequest mockScriptContext)
--     , testCase "Fail: Redeem amount exceeds requiredReward" $
--         let badRedeem = testRedeemRequest { redeemReward = 60 }
--         in assertBool "Validator should fail when redeemReward is too high"
--            (not $ mkRedeemValidator testUserState badRedeem mockScriptContext)
--     ]
-- -- | Main test function
-- main :: IO ()
-- main = defaultMain testRedeemValidator
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
{-# OPTIONS_GHC -Wno-missing-export-lists #-}
{-# OPTIONS_GHC -Wno-missing-fields #-}
{-# OPTIONS_GHC -Wno-unused-imports #-}

module Reward.Redeem where

import Cardano.Api
import Cardano.Api.Shelley (PlutusScript (..), displayError, writeFileTextEnvelope)
import Codec.Serialise (serialise)
import Data.Aeson (decodeFileStrict')
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import GHC.Generics (Generic)
import Plutus.Script.Utils.V2.Typed.Scripts
import qualified Plutus.Script.Utils.V2.Typed.Scripts as Scripts
import Plutus.V2.Ledger.Api (BuiltinByteString, BuiltinData, Datum (..), DatumHash, POSIXTime, ScriptContext, Validator, ValidatorHash, mkValidatorScript, scriptContextTxInfo, txInfoOutputs, txOutDatum, unValidatorScript)
import qualified Plutus.V2.Ledger.Api
import Plutus.V2.Ledger.Contexts (ScriptContext (..), TxInfo (..), findDatum)
import PlutusTx (compile, fromBuiltinData, toBuiltinData, unsafeFromBuiltinData, unstableMakeIsData)
import qualified PlutusTx.AssocMap as AssocMap
import PlutusTx.Prelude (Bool (False, True), Either (Left, Right), Maybe (Nothing), error, pure, toBuiltin, trace, traceError, traceIfFalse, (&&), (-), (.), (<=), (==), (>=))
import System.Directory (createDirectoryIfMissing)
import System.FilePath (takeDirectory)
import Test.Tasty (TestTree, defaultMain, testGroup)
import Test.Tasty.HUnit (assertBool, testCase)
import Prelude (Bool, FilePath, IO, Integer, Maybe (Just), Show, String, any, mempty, not, print, putStrLn, show, undefined, writeFile, ($), (++), (>>))

data RedeemRequest = RedeemRequest
  { userId :: BuiltinByteString,
    redeemReward :: Integer,
    referenceId :: BuiltinByteString,
    requiredReward :: Integer,
    value :: Integer,
    timestamp :: POSIXTime
  }

PlutusTx.unstableMakeIsData ''RedeemRequest

data UserState = UserState
  { uUserId :: BuiltinByteString,
    rewardBalance :: Integer
  }

PlutusTx.unstableMakeIsData ''UserState

{-# INLINEABLE mkRedeemValidator #-}
mkRedeemValidator :: UserState -> RedeemRequest -> ScriptContext -> Bool
mkRedeemValidator userState redeemReq ctx =
  let -- Get the transaction info from the context
      info = scriptContextTxInfo ctx
      sufficientBalance = redeemReward redeemReq <= rewardBalance userState
      rewardMatch = redeemReward redeemReq <= requiredReward redeemReq

      updatedReward = rewardBalance userState - redeemReward redeemReq
      -- Generate the updated UserState with the new rewardBalance
      updatedUserState = UserState (uUserId userState) updatedReward
   in -- All conditions must be true for the transaction to be valid
      traceIfFalse "Insufficient balance" sufficientBalance
        && traceIfFalse "Reward mismatch" rewardMatch

-- traceIfFalse "Updated reward not found" isUpdatedStatePresent

{-# INLINEABLE typedRedeemValidator #-}
typedRedeemValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
typedRedeemValidator datum redeemer context =
  case (PlutusTx.fromBuiltinData datum, PlutusTx.fromBuiltinData redeemer, PlutusTx.fromBuiltinData context) of
    (Just userState, Just redeemReq, Just ctx) ->
      if mkRedeemValidator userState redeemReq ctx
        then ()
        else traceError "Validation failed"
    (Nothing, _, _) -> traceError "Failed to decode datum."
    (_, Nothing, _) -> traceError "Failed to decode redeemer."
    (_, _, Nothing) -> traceError "Failed to decode context."

writeUpdatedReward :: FilePath -> UserState -> RedeemRequest -> IO ()
writeUpdatedReward file userState redeemReq = do
  let updatedReward = rewardBalance userState - redeemReward redeemReq
      updatedUserState = UserState (uUserId userState) updatedReward
      output = "User: " ++ show (uUserId userState) ++ "\nUpdated Reward Balance: " ++ show updatedReward
  createDirectoryIfMissing True (takeDirectory file)
  writeFile file output
  putStrLn "Updated reward written to file successfully."

-- Create the untyped validator script

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [||typedRedeemValidator||])

writePlutusScript :: FilePath -> Validator -> IO ()
writePlutusScript file validator = do
  -- let script = PlutusScriptSerialised . SBS.toShort . LBS.toStrict $ serialise validator

  createDirectoryIfMissing True (takeDirectory file)
  result <-
    writeFileTextEnvelope @(PlutusScript PlutusScriptV2) file Nothing $
      PlutusScriptSerialised . SBS.toShort . LBS.toStrict . serialise $
        Plutus.V2.Ledger.Api.unValidatorScript
          validator
  case result of
    Left err -> print $ displayError err
    Right () -> putStrLn "Successfully wrote Plutus script to file."

writeScript :: IO ()
writeScript = writePlutusScript "Reward/Redeem.plutus" validator

-- | Test data
testUserState :: UserState
testUserState =
  UserState
    { uUserId = "user123",
      rewardBalance = 100
    }

testRedeemRequest :: RedeemRequest
testRedeemRequest =
  RedeemRequest
    { userId = "user123",
      redeemReward = 30,
      referenceId = "txn456",
      requiredReward = 50,
      value = 10,
      timestamp = 1680000000
    }

mockScriptContext :: ScriptContext
mockScriptContext =
  ScriptContext
    { scriptContextTxInfo =
        TxInfo
          { txInfoOutputs = [],
            txInfoInputs = [],
            txInfoValidRange = undefined,
            txInfoSignatories = [],
            txInfoMint = mempty,
            txInfoId = undefined,
            txInfoData = AssocMap.empty,
            txInfoReferenceInputs = []
          },
      scriptContextPurpose = undefined
    }

-- | Test cases
testRedeemValidator :: TestTree
testRedeemValidator =
  testGroup
    "Redeem Validator Tests"
    [ testCase "Successful redemption" $
        assertBool
          "Validator should pass for valid request"
          (mkRedeemValidator testUserState testRedeemRequest mockScriptContext),
      testCase "Fail: Insufficient balance" $
        let badState = testUserState {rewardBalance = 20}
         in assertBool
              "Validator should fail when balance is insufficient"
              (not $ mkRedeemValidator badState testRedeemRequest mockScriptContext),
      testCase "Fail: Redeem amount exceeds requiredReward" $
        let badRedeem = testRedeemRequest {redeemReward = 60}
         in assertBool
              "Validator should fail when redeemReward is too high"
              (not $ mkRedeemValidator testUserState badRedeem mockScriptContext)
    ]

-- | Main test function
main :: IO ()
main = do
  let isValid = mkRedeemValidator testUserState testRedeemRequest mockScriptContext
  if isValid
    then writeUpdatedReward "Reward/UpdatedReward.txt" testUserState testRedeemRequest
    else putStrLn "Validation failed. Reward not updated."
  defaultMain testRedeemValidator