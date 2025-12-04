import fetch from "node-fetch";

// const Vaa = {
//   vaa: "AQAAAAQNAnWSm4qzFNPlI8zqvgM8/3GgkXiV24hHm0KbfBueqgL7JwE5Dt6MUxESfk7J9OqncUSipQ9hQSDepXqZxiVzzXAAA4URquKQRVs7KhqPM7hr1N8zTEeSjoFaf3WF7GVll6LZIBKZfTx2xi2NoMrHy+r+T9av4xL1R8d+GzqWkQyvZqMABIKVgCJcakX7dPuMpokafr/sAFHPDrAPJP4El4NrOkFpPYrafZ+Mvr/Ci71Zd7jZAx8WvmzIEEJzu+QoXV5TMH4BBa9zo5GNBFqJhFDKiUXIK+hzjSE/GpdppJr5uXsm3szTA/h0jplDrD1CCgo4+C5OoYiKwd+AwAuqQ7qmpcXNUtYBBksQ1nwtgih5U2tCUM1vYo1zx17FK13mcvlo0tb4IL/LV3EGK+CbGh+fR4Lj5KAPTt6yCte9c82Xs31BnFrEzhsAByBZ+k/0E7aI+l/2UFzG9R/y5d5t2bcz1MvdPB4B38nXLJr9V6Ig+djILVB/dTOQ1ekvUW8hAElpD8PrQJB1mSgBCHy50Yo2Ep6D8f9jZXwaVmcWs1sTsWM3ohPrvAO86us5DBQlUC+njZMJgV8n1THNQzI9pqg5VCw909lYXFVT37sBCrfWrW1W5cGUJbcABABOyMUbeHd0ZHqLSt7UHfTCZXU4dTYVhHpRS3CM/LpwgrFamXeYvahUvPUn2lSdabweEx8ADK6bYzr1He6I8HLYn76526IdizvRbe+4TZwUvkRz3tS1a9mt2oAEGzTgxIFO5u1ENqfsBWmSqawFteBlHLOVHmEADqaw1uykLn++VAUT/zxQmhM08MP8XzlskEpOMXItt4bZBRhn7wcBOK7uEbWDGUiyEIv3lT15gdk/2WlHmmh68hcADwHlCG6Fvo5lAlRYmxdnL5Cj3KDuO08qUwDh6BkXQbFUVk4iPpboN49aaz/H2Ql2Q85aiBDhQ3MaaZB4IJi5AO4BEGyO7AmOuSYJECUsQxzPptNlkEpNIsx79m8dbH+QQNGtTObaSveV4XQmy7s5aS/rhVJgWPio00mKjVOMB8x33OEAEY89NNf/BCb+NFyq37LMP1DBJGMDOb2t5/0pd5UOjfSzTjYUYL0wXA+1XoC0Y7PM6qW1Y8R9hp9RqoBSVaf2lb8BaS/XlwAAAAAAAgAAAAAAAAAAAAAAAD7hiyIUr/lwANl0z2R+fDR+j6WFAAAAAAAJArQBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtjSyeRAAAAAAAAAAAAAAAAAE1Qs/x4S1gFMdjoYVqpbPf7uRkABAAAAAAAAAAAAAAAAD4JVNmzL4I6/y9mFz/+1fRT3t2TAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
// };

async function parseVaas(vaa) {
  if (!vaa) throw new Error("VAA string is required");
  //   console.log("Parsing VAA:", vaa.slice(0, 20) + "...");
  const res = await fetch("https://api.wormholescan.io/api/v1/vaas/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vaa }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json;
}

export { parseVaas };
