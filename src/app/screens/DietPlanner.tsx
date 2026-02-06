import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Apple, Coffee, AlertCircle, Leaf } from "lucide-react";
import { api } from "../api/client";
import { type SupportedLanguage } from "../utils/i18n";

export function DietPlanner() {
  const navigate = useNavigate();
  const [dietType, setDietType] = useState<"veg" | "nonveg">("nonveg");
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [translatedAdvice, setTranslatedAdvice] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [translatedPlan, setTranslatedPlan] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  const ironRichFoods = {
    veg: [
      { name: "Spinach", iron: "2.7mg per 100g", icon: "🥬" },
      { name: "Lentils", iron: "3.3mg per 100g", icon: "🫘" },
      { name: "Chickpeas", iron: "2.9mg per 100g", icon: "🫘" },
      { name: "Tofu", iron: "2.7mg per 100g", icon: "🥡" },
      { name: "Quinoa", iron: "1.5mg per 100g", icon: "🌾" },
      { name: "Pumpkin Seeds", iron: "8.8mg per 100g", icon: "🎃" },
    ],
    nonveg: [
      { name: "Red Meat", iron: "2.7mg per 100g", icon: "🥩" },
      { name: "Chicken Liver", iron: "11mg per 100g", icon: "🍗" },
      { name: "Oysters", iron: "5.5mg per 100g", icon: "🦪" },
      { name: "Sardines", iron: "2.9mg per 100g", icon: "🐟" },
      { name: "Eggs", iron: "1.8mg per 100g", icon: "🥚" },
      { name: "Turkey", iron: "1.4mg per 100g", icon: "🦃" },
    ],
  };

  const vitaminCFoods = [
    { name: "Oranges", benefit: "Enhances iron absorption", icon: "🍊" },
    { name: "Tomatoes", benefit: "Rich in vitamin C", icon: "🍅" },
    { name: "Bell Peppers", benefit: "High vitamin C content", icon: "🫑" },
    { name: "Strawberries", benefit: "Boosts iron uptake", icon: "🍓" },
    { name: "Broccoli", benefit: "Contains vitamin C & iron", icon: "🥦" },
    { name: "Kiwi", benefit: "Excellent vitamin C source", icon: "🥝" },
  ];

  const avoidFoods = [
    { name: "Tea/Coffee with meals", reason: "Contains tannins that inhibit iron absorption", icon: "☕" },
    { name: "Calcium-rich foods with iron", reason: "Calcium competes with iron absorption", icon: "🥛" },
    { name: "Whole grains with iron", reason: "Phytates can reduce iron absorption", icon: "🌾" },
  ];

  const mealPlan = {
    breakfast: {
      veg: ["Spinach & tomato omelette", "Fortified cereal with orange juice", "Quinoa porridge with berries"],
      nonveg: ["Scrambled eggs with spinach", "Chicken sausage with tomatoes", "Salmon with whole grain toast"],
    },
    lunch: {
      veg: ["Lentil curry with rice", "Chickpea salad with peppers", "Tofu stir-fry with broccoli"],
      nonveg: ["Grilled chicken with vegetables", "Beef stir-fry with bell peppers", "Fish curry with spinach"],
    },
    dinner: {
      veg: ["Spinach dal with roti", "Bean & vegetable soup", "Quinoa bowl with roasted vegetables"],
      nonveg: ["Lean red meat with greens", "Turkey breast with salad", "Sardines with tomato sauce"],
    },
  };

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.language) setLanguage(parsed.language);
    } catch {
      // ignore invalid preferences
    }
  }, []);

  const maybeTranslate = (text: string) => {
    if (language === "English" || !translatedAdvice) return text;
    return `[${language}] ${text}`;
  };

  const generatePlan = async () => {
    setPlanLoading(true);
    setAiPlan(null);
    const notes = dietType === "veg"
      ? "Focus on lentils, spinach, tofu, and vitamin C sources."
      : "Prioritize lean red meat, eggs, and leafy greens with vitamin C.";
    try {
      const res = await api.diet(dietType, notes);
      setAiPlan(res.plan);
    } catch {
      const plan =
        dietType === "veg"
          ? "AI Plan: Focus on lentils, spinach, tofu, and vitamin C sources to improve iron absorption."
          : "AI Plan: Prioritize lean red meat, eggs, and leafy greens with vitamin C for better iron uptake.";
      setAiPlan(plan);
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Diet Planner 🥗</h1>
              <p className="text-xs text-gray-600">Personalized nutrition guide 🍽️</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Diet Type Toggle */}
        <Card className="mb-6 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-600" />
              Your Diet Preference 🧩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={dietType === "veg" ? "default" : "outline"}
                className={dietType === "veg" ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setDietType("veg")}
              >
                <Leaf className="w-4 h-4 mr-2" />
                Vegetarian
              </Button>
              <Button
                variant={dietType === "nonveg" ? "default" : "outline"}
                className={dietType === "nonveg" ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setDietType("nonveg")}
              >
                Non-Vegetarian
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Plan & Translation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generative AI Diet Plan ✨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant="outline" onClick={generatePlan} disabled={planLoading}>
                {planLoading ? "Generating..." : "Generate Plan"}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const next = !translatedAdvice;
                  setTranslatedAdvice(next);
                  if (next && aiPlan && language !== "English") {
                    try {
                      const res = await api.translate(aiPlan, language);
                      setTranslatedPlan(res.translated);
                    } catch {
                      setTranslatedPlan(`[${language}] ${aiPlan}`);
                    }
                  } else {
                    setTranslatedPlan(null);
                  }
                }}
              >
                {translatedAdvice ? "Show Original Advice" : "Translate Advice"}
              </Button>
            </div>
            {aiPlan ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
                {translatedAdvice && language !== "English" && translatedPlan
                  ? translatedPlan
                  : aiPlan}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Generate a tailored plan based on your diet preference.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Iron-Rich Foods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Iron-Rich Foods 🧲</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {ironRichFoods[dietType].map((food, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-lg" aria-hidden>{food.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-600">{food.iron}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Iron</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vitamin C Foods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vitamin C Foods (Boost Iron Absorption) 🍊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {vitaminCFoods.map((food, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-lg" aria-hidden>{food.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-600">{food.benefit}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Vit C</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                {maybeTranslate("Tip: Combine iron-rich foods with vitamin C sources in the same meal for maximum absorption!")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Foods to Avoid */}
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              {maybeTranslate("Foods to Avoid with Iron-Rich Meals")} ⚠️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {avoidFoods.map((food, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-lg" aria-hidden>{food.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-600">{food.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <Coffee className="w-4 h-4 inline mr-1" />
                {maybeTranslate("Wait at least 1-2 hours after an iron-rich meal before consuming tea or coffee.")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Meal Plan */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Meal Plan 📅</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="breakfast" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
              </TabsList>
              
              <TabsContent value="breakfast" className="space-y-3 mt-4">
                {mealPlan.breakfast[dietType].map((meal, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden>🍽️</span>
                      <p className="font-medium text-gray-900">{meal}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="lunch" className="space-y-3 mt-4">
                {mealPlan.lunch[dietType].map((meal, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden>🍽️</span>
                      <p className="font-medium text-gray-900">{meal}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="dinner" className="space-y-3 mt-4">
                {mealPlan.dinner[dietType].map((meal, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden>🍽️</span>
                      <p className="font-medium text-gray-900">{meal}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Hydration Reminder */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">TIP</span>
            <div>
              <p className="font-medium text-gray-900">Stay Hydrated</p>
              <p className="text-sm text-gray-600">Drink 8-10 glasses of water daily to support overall health and nutrient absorption</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
