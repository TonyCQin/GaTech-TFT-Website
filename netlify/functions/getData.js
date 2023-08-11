const util = require("./util");

async function getData() {
  const data = JSON.parse((await util.getData()).info.userinfo);
  //   console.log(data);
  return data;
}

exports.handler = async function () {
  const data = await getData();
  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};

getData();
