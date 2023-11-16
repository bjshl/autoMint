const { ethers } = require("ethers");

// 配置你的私钥和目标地址
const privateKey = "替换你的私钥"; 
const toAddress = "转账地址，就是你打的地址"; 

// 连接到 Polygon 节点
const provider = new ethers.providers.JsonRpcProvider("Polygon节点，炼金术自行申请"); 

// 创建钱包
const wallet = new ethers.Wallet(privateKey, provider);

// 自定义十六进制数据
const hexData = "0x646174613a2c7b2270223a227072632d3230222c226f70223a226d696e74222c227469636b223a22706f6c73222c22616d74223a22313030303030303030227d"; // 替换为你想要的十六进制数据

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
  try {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce:", nonce);
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error.message);
    throw error;
  }
}

// 获取当前主网 gas 价格
async function getGasPrice() {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
}

// 转账交易
async function sendTransaction(nonce, gasPrice) {
  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther("0"), // 替换为你要转账的金额
    data: hexData, // 十六进制数据
    nonce: nonce, // 设置 nonce
    gasPrice: gasPrice, // 设置 gas 价格
    gasLimit: 22100, //限制gasLimit，根据当前网络转账的设置，不知道设置多少的去区块浏览器看别人转账成功的是多少
  };

  try {
    const tx = await wallet.sendTransaction(transaction);
    console.log(`Transaction with nonce ${nonce} hash:`, tx.hash);
  } catch (error) {
    console.error(`Error in transaction with nonce ${nonce}:`, error.message);
  }
}

// 定义重复次数
const repeatCount = 20; // 你想要打多少张，这里就设置多少

// 发送多次交易
async function sendTransactions() {
  const currentNonce = await getCurrentNonce(wallet);
  const gasPrice = await getGasPrice();

  for (let i = 0; i < repeatCount; i++) {
    await sendTransaction(currentNonce + i, gasPrice);
  }
}

sendTransactions();