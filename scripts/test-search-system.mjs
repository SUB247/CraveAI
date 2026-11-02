// Automated verification test suite for CraveAI Search & Recommendations
const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function runTests() {
  console.log("=== CRAVEAI SEARCH & RECOMMENDATION TEST SUITE ===");
  let passed = 0;
  let total = 0;

  function assert(condition, label) {
    total++;
    if (condition) {
      console.log(`[PASS] ${label}`);
      passed++;
    } else {
      console.error(`[FAIL] ${label}`);
    }
  }

  try {
    // 1. Suggestions endpoint with keyword
    const sugRes = await fetch(`${BASE_URL}/api/search/suggestions?q=paneer`);
    const sugData = await sugRes.json();
    assert(sugRes.ok && sugData.recipes?.length > 0, "1. Suggestions return matching recipes for 'paneer'");
    assert(sugData.recipes[0].id.includes("paneer"), "2. Suggestion recipe ID matches expected dish");

    // 2. Empty query suggestions (Popular Right Now)
    const emptyRes = await fetch(`${BASE_URL}/api/search/suggestions?q=`);
    const emptyData = await emptyRes.json();
    assert(emptyRes.ok && emptyData.recipes?.length > 0, "3. Empty search suggestions return popular dishes");

    // 3. Full Search endpoint
    const searchRes = await fetch(`${BASE_URL}/api/search?q=butter+chicken`);
    const searchData = await searchRes.json();
    assert(searchRes.ok && searchData.items?.length >= 1, "4. Search endpoint returns results for 'butter chicken'");
    assert(searchData.items[0].title.toLowerCase().includes("butter chicken"), "5. Search result title matches query");

    // 4. Recommendations endpoint
    const recRes = await fetch(`${BASE_URL}/api/recommendations`);
    const recData = await recRes.json();
    assert(recRes.ok && Array.isArray(recData.sections) && recData.sections.length > 0, "6. Recommendations endpoint returns structured sections");
    assert(recData.sections[0].recipes?.length > 0, "7. Recommendation section contains recipe items");

    // 5. Similar recipes endpoint
    const simRes = await fetch(`${BASE_URL}/api/recipes/butter-chicken-murgh-makhani/similar`);
    const simData = await simRes.json();
    assert(simRes.ok && Array.isArray(simData.similar) && simData.similar.length > 0, "8. Similar recipes endpoint returns related recipes");

    // 6. Auth status endpoint
    const authRes = await fetch(`${BASE_URL}/api/auth/user`);
    const authData = await authRes.json();
    assert(authRes.ok && typeof authData.configured === "boolean", "9. Auth status endpoint reports configuration state safely");

    // 7. Interaction logging endpoint
    const interRes = await fetch(`${BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: "butter-chicken-murgh-makhani", interactionType: "view" }),
    });
    const interData = await interRes.json();
    assert(interRes.ok && interData.success === true, "10. Interaction logging accepts view events gracefully");

    // 8. Recipe detail page accessibility
    const recipePageRes = await fetch(`${BASE_URL}/recipe/butter-chicken-murgh-makhani`);
    assert(recipePageRes.ok, "11. Recipe detail page is functional and accessible");

    // 9. Explore / Search page accessibility
    const explorePageRes = await fetch(`${BASE_URL}/explore?search=curry`);
    assert(explorePageRes.ok, "12. Explore & search page renders with query params");

    console.log(`\nRESULTS: ${passed}/${total} assertions passed successfully!`);
    if (passed === total) {
      console.log("All search and recommendation acceptance criteria verified.");
    }
  } catch (error) {
    console.error("Test execution encountered an error:", error);
  }
}

runTests();
