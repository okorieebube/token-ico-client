import { TokenConstants } from "../_constants/token-constants";
import { token } from "../../../lib/ethers/contracts/token_methods";
import { Request } from "../../../lib/api/http";
import { ethers } from "hardhat";

const {
  FETCH_TOKEN_DETAILS_REQUEST,
  FETCH_TOKEN_DETAILS_SUCCESS,
  FETCH_TOKEN_DETAILS_FAILURE,
} = TokenConstants;

export const _fetchTokenDetails = () => async (dispatch) => {
  console.log("fetching token details...");
  dispatch({ type: FETCH_TOKEN_DETAILS_REQUEST });

  fetchTokenDetailsFromApi();
  return;

  try {
    let name = await token.name();
    if (name.error) {
      throw name.error;
    }
    let totalSupply = await token.totalSupply();
    if (totalSupply.error) {
      throw totalSupply.error;
    }
    let symbol = await token.symbol();
    if (symbol.error) {
      throw symbol.error;
    }
    let decimals = await token.decimals();
    if (decimals.error) {
      throw decimals.error;
    }
    let data = {
      name: name.message,
      totalSupply: totalSupply.message,
      symbol: symbol.message,
      decimals: decimals.message,
    };
    dispatch({
      type: FETCH_TOKEN_DETAILS_SUCCESS,
      payload: data,
    });
    // console.log(data);
  } catch (error) {
    dispatch({
      type: FETCH_TOKEN_DETAILS_FAILURE,
      payload: error,
    });
    // SimpleToastError(_name.message);
    console.log({ error });
  }
};

export const fetchTokenDetailsFromApi = async () => {
  // "https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=" +
  //   process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS +"&apikey=" +process.env.REACT_APP_POLYGONSCAN_API_KEY;

  let { data } = await Request.get(
    "https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=0x7e1B41ba3b4965751f09a0dA7294F84e3241722D&apikey=" +
      process.env.REACT_APP_POLYGONSCAN_API_KEY
  );
  if (data.status == 0) console.log(data.result);
  let ABI = JSON.parse(data.result);

  const contractInstance = new ethers.Contract(
    '0x7e1B41ba3b4965751f09a0dA7294F84e3241722D',
    ABI
  );
  let result = await contractInstance.name();

  // if (ABI != "") {
  //   var MyContract = web3.eth.contract(ABI);
  //   var myContractInstance = MyContract.at(
  //     "0x7e1B41ba3b4965751f09a0dA7294F84e3241722D"
  //   );
  //   var result = myContractInstance.name();
  //   console.log("result1 : " + result);
  // } else {
  //   console.log("Error");
  // }

  console.log(result);
};


