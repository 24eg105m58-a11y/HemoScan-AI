import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, BookOpen, Users, Baby, Heart, AlertCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Awareness() {
  const navigate = useNavigate();

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
              <h1 className="text-lg font-semibold text-gray-900">Awareness & Guidelines 📘</h1>
              <p className="text-xs text-gray-600">WHO-aligned health education 🌍</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hero Card */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Understanding Anemia 🩸
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Anemia is a condition where your blood doesn't have enough healthy red blood cells to carry 
              adequate oxygen to your body's tissues. It affects over 1.6 billion people globally.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <p className="text-2xl font-bold text-blue-600 mb-1">1.6B+</p>
                <p className="text-sm text-gray-600">People Affected Globally</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-red-100">
                <p className="text-2xl font-bold text-red-600 mb-1">40%</p>
                <p className="text-sm text-gray-600">Pregnant Women Affected</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-100">
                <p className="text-2xl font-bold text-purple-600 mb-1">30%</p>
                <p className="text-sm text-gray-600">Children Under 5 Affected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Anemia */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle>Types of Anemia 🧬</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="iron">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🩸</span>
                    <span>Iron Deficiency Anemia (Most Common)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-10 space-y-2 text-gray-700">
                    <p>Caused by insufficient iron in the body, which is needed to produce hemoglobin.</p>
                    <p className="font-semibold">Common Causes:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Poor diet lacking iron-rich foods</li>
                      <li>Blood loss (menstruation, ulcers, cancer)</li>
                      <li>Inability to absorb iron</li>
                      <li>Pregnancy</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="vitamin">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💊</span>
                    <span>Vitamin Deficiency Anemia</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-10 space-y-2 text-gray-700">
                    <p>Caused by deficiency of vitamin B12 or folate (vitamin B9).</p>
                    <p className="font-semibold">Key Facts:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>B12 deficiency: Often in vegetarians/vegans or malabsorption issues</li>
                      <li>Folate deficiency: Common in pregnancy, poor diet, or alcoholism</li>
                      <li>Can cause neurological symptoms</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="chronic">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚕️</span>
                    <span>Anemia of Chronic Disease</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-10 space-y-2 text-gray-700">
                    <p>Associated with chronic inflammatory diseases.</p>
                    <p className="font-semibold">Related Conditions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Kidney disease</li>
                      <li>Cancer</li>
                      <li>Rheumatoid arthritis</li>
                      <li>Crohn's disease</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sickle">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    <span>Sickle Cell Anemia (Genetic)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-10 space-y-2 text-gray-700">
                    <p>An inherited form where red blood cells become crescent-shaped.</p>
                    <p className="font-semibold">Characteristics:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Genetic disorder passed from parents</li>
                      <li>More common in people of African, Middle Eastern descent</li>
                      <li>Requires specialized treatment</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* NGO Outreach Insights */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle>NGO Outreach Insights 🧾</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Aggregated reports from partner NGOs showing screening outcomes and education reach.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { label: "Screened", value: 5200 },
                    { label: "Counseled", value: 3600 },
                    { label: "Referred", value: 820 },
                    { label: "Follow-ups", value: 460 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              These figures are anonymized and represent combined outreach efforts.
            </p>
          </CardContent>
        </Card>

        {/* Target Groups */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle>Prevention Guidelines by Group 👥</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="women" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="women">
                  <Users className="w-4 h-4 mr-2" />
                  Women
                </TabsTrigger>
                <TabsTrigger value="children">
                  <Baby className="w-4 h-4 mr-2" />
                  Children
                </TabsTrigger>
                <TabsTrigger value="adolescents">
                  <Heart className="w-4 h-4 mr-2" />
                  Teens
                </TabsTrigger>
              </TabsList>

              <TabsContent value="women" className="space-y-4 mt-4">
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Pregnant Women</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Pregnancy increases iron needs significantly. WHO recommends daily iron and folic acid supplementation.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Take 30-60mg elemental iron daily during pregnancy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Include 400 mcg folic acid daily</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Regular antenatal check-ups with Hb testing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Eat iron-rich foods: red meat, leafy greens, lentils</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Women of Reproductive Age</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Monitor iron levels if heavy menstrual periods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Maintain balanced diet with iron-rich foods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Annual Hb screening recommended</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="children" className="space-y-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Infants & Young Children (6 months - 5 years)</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Children have high iron needs for rapid growth and brain development.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Exclusive breastfeeding for first 6 months</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Iron-fortified cereals from 6 months</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Include pureed meats, beans, iron-fortified foods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Limit cow's milk to prevent iron deficiency</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Regular pediatric check-ups with Hb screening</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adolescents" className="space-y-4 mt-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Adolescents (10-19 years)</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Rapid growth spurts and menstruation in girls increase iron requirements.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Girls: Higher iron needs due to menstruation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Boys: Increased needs during growth spurts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Balanced diet with lean meats, legumes, fortified foods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Education on nutrition and health awareness</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Avoid crash diets that may cause deficiencies</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Prevention Tips */}
        <Card className="mb-6 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              General Prevention Tips ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Dietary Recommendations</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Eat iron-rich foods daily</li>
                  <li>• Combine with vitamin C sources</li>
                  <li>• Include folate-rich foods</li>
                  <li>• Consider fortified foods</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Lifestyle Habits</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Regular health check-ups</li>
                  <li>• Manage chronic conditions</li>
                  <li>• Avoid excessive tea/coffee</li>
                  <li>• Stay hydrated</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Medical Care</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Get blood tests regularly</li>
                  <li>• Follow prescribed supplements</li>
                  <li>• Report symptoms early</li>
                  <li>• Consult healthcare providers</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Special Considerations</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Pregnancy: Extra supplementation</li>
                  <li>• Athletes: Monitor iron levels</li>
                  <li>• Vegetarians: Plant-based sources</li>
                  <li>• Elderly: Regular screening</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WHO Guidelines */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
          <CardTitle>WHO-Aligned Guidelines 📄</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              This application follows World Health Organization (WHO) guidelines for anemia prevention and control:
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                <span className="text-blue-600 font-semibold">1.</span>
                <span>Universal screening for at-risk populations</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                <span className="text-blue-600 font-semibold">2.</span>
                <span>Iron and folic acid supplementation during pregnancy</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                <span className="text-blue-600 font-semibold">3.</span>
                <span>Food fortification programs in endemic areas</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                <span className="text-blue-600 font-semibold">4.</span>
                <span>Public health education and awareness campaigns</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

