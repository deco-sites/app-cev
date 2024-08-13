import { AppContext } from "../apps/site.ts";

async function loader(
  props: { form: any },
  _req: Request,
  ctx: AppContext,
) {
  const apiKey = ctx.gatewayApiKey.get();
  try {
    const formData = new FormData();
    for (const key in props.form) {
      if (key === 'file') {
        const file = props.form[key];
        formData.append(key, new File([file], file.name, { type: file.type }));
      } else {
        formData.append(key, props.form[key]);
      }
    }
    const aResponse = await fetch(
      "https://api-cev-gateway.lebiscuit.io/deco/v1/upload-model",
      {
        method: "POST",
        body: formData,
        headers: {
          "X-Api-Key": apiKey,
        },
      },
    )
    return aResponse;
  } catch (error) {
    return {
      error,
      key: apiKey
    }
    console.log(error)
  };
}

export default loader;
