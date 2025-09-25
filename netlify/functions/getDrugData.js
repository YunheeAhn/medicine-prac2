export async function handler(event, context) {
  try {
    const query = event.queryStringParameters?.q;
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "검색어를 입력해주세요." }),
      };
    }

    const url = `https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03?serviceKey=${
      process.env.API_KEY
    }&type=json&itemName=${encodeURIComponent(query)}&numOfRows=10&pageNo=1`;

    const response = await fetch(url);

    // JSON이 아닌 경우 대비
    const text = await response.text();

    if (!response.ok) {
      console.error("API 호출 실패:", text);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API 호출 실패", detail: text }),
      };
    }

    let rawData;
    try {
      rawData = JSON.parse(text);
    } catch {
      console.error("JSON 파싱 실패:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "JSON 파싱 실패", detail: text }),
      };
    }

    const items = rawData?.body?.items || [];

    const filteredData = items.map((item) => ({
      ITEM_SEQ: item.ITEM_SEQ,
      ITEM_NAME: item.ITEM_NAME,
      CLASS_NAME: item.CLASS_NAME,
      MIXTURE_MIX: item.MIXTURE_MIX,
      MIXTURE_ITEM_NAME: item.MIXTURE_ITEM_NAME,
      MIXTURE_MAIN_INGR: item.MIXTURE_MAIN_INGR,
      PROHBT_CONTENT: item.PROHBT_CONTENT,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(filteredData),
    };
  } catch (err) {
    console.error("Function 에러:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "서버 에러 발생", detail: err.message }),
    };
  }
}
