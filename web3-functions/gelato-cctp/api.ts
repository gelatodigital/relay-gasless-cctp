import { GELATO_API, CIRCLE_API } from "../../src/cctp-sdk/constants";
import { CallWithSyncFeeRequest } from "@gelatonetwork/relay-sdk";
import {
  IAttestation,
  AttesationState,
  IRelayRequestResponse,
  IRelayTaskStatusResponse,
} from "./types";
import ky from "ky";

const getErrorMsg = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const getRelayTaskStatus = async (taskId: string) => {
  try {
    const { task } = (await ky
      .get(`${GELATO_API}/tasks/status/${taskId}`)
      .json()) as IRelayTaskStatusResponse;
    return task;
  } catch (e) {
    console.error("getRelayTaskStatus:", getErrorMsg(e));
    return null;
  }
};

export const getAttestation = async (messageHash: string) => {
  console.log(`${CIRCLE_API}/attestations/${messageHash}`);

  try {
    const { status, attestation } = (await ky
      .get(`${CIRCLE_API}/attestations/${messageHash}`)
      .json()) as IAttestation;
    return status === AttesationState.Complete ? attestation : null;
  } catch (e) {
    console.error("getAttestation:", getErrorMsg(e));
    return null;
  }
};

export const postRelayRequest = async (request: CallWithSyncFeeRequest) => {
  try {
    const { taskId } = (await ky
      .post(`${GELATO_API}/relays/v2/call-with-sync-fee`, {
        json: { ...request, retries: 0 },
      })
      .json()) as IRelayRequestResponse;
    return taskId;
  } catch (e) {
    console.error("postRelayRequest:", getErrorMsg(e));
    return null;
  }
};