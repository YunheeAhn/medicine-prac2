document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch(`/.netlify/functions/getDrugData?q=${encodeURIComponent(query)}`);
    const text = await res.text(); // JSON 아닌 경우 대비
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("JSON 파싱 실패:", text);
      document.getElementById("drug-list").innerHTML = `<p>데이터 파싱 실패</p>`;
      return;
    }

    const container = document.getElementById("drug-list");

    if (data.error) {
      container.innerHTML = `<p>${data.error}</p>`;
      console.error("API 에러:", data.detail);
      return;
    }

    if (data.length === 0) {
      container.innerHTML = `<p>검색 결과가 없습니다.</p>`;
      return;
    }

    container.innerHTML = data
      .map(
        (d) => `
      <div class="drug-card">
        <h3>${d.ITEM_NAME}</h3>
        <p><b>제품번호:</b> ${d.ITEM_SEQ}</p>
        <p><b>분류:</b> ${d.CLASS_NAME}</p>
        <p><b>혼합여부:</b> ${d.MIXTURE_MIX}</p>
        <p><b>혼합 약품:</b> ${d.MIXTURE_ITEM_NAME}</p>
        <p><b>주성분:</b> ${d.MIXTURE_MAIN_INGR}</p>
        <p><b>금기 내용:</b> ${d.PROHBT_CONTENT}</p>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("프론트 fetch 에러:", err);
  }
});
