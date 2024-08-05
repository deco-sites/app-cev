import { AppContext } from "../apps/site.ts";

async function loader(
  props: { form: FormData },
  _req: Request,
  ctx: AppContext,
) {
  const apiKey = ctx.gatewayApiKey.get();
  return await fetch(
    "https://api-cev-gateway.lebiscuit.io/deco/v1/upload-model",
    {
      method: "POST",
      body: props.form,
      headers: {
        "X-Api-Key": apiKey,
      },
    },
  );
}

export default loader;
