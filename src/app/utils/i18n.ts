export type SupportedLanguage =
  | "English"
  | "Hindi"
  | "Tamil"
  | "Telugu"
  | "Spanish"
  | "Arabic";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  English: {},
  Hindi: {
    "Basic Information": "मूल जानकारी",
    "Physical Metrics": "शारीरिक माप",
    "Diet & Lifestyle": "आहार और जीवनशैली",
    "Health Conditions": "स्वास्थ्य स्थितियाँ",
    "Create Account": "खाता बनाएँ",
    "Check Anemia Risk": "एनीमिया जोखिम जाँचें",
    "Generative AI Features": "जनरेटिव एआई फीचर्स",
    "Step": "चरण",
    "Next": "आगे",
    "Back": "पीछे",
    "Get Started": "शुरू करें",
    "Login": "लॉगिन",
  },
  Tamil: {
    "Basic Information": "அடிப்படை தகவல்",
    "Physical Metrics": "உடல் அளவுகள்",
    "Diet & Lifestyle": "உணவு & வாழ்க்கைமுறை",
    "Health Conditions": "சுகாதார நிலைகள்",
    "Create Account": "கணக்கை உருவாக்கு",
    "Check Anemia Risk": "இரத்தச்சோகை ஆபத்தை சரிபார்",
    "Generative AI Features": "ஜெனரேட்டிவ் AI அம்சங்கள்",
    "Step": "படி",
    "Next": "அடுத்து",
    "Back": "மீண்டும்",
    "Get Started": "தொடங்குங்கள்",
    "Login": "உள்நுழை",
  },
  Telugu: {
    "Basic Information": "మూల సమాచారం",
    "Physical Metrics": "శరీర కొలతలు",
    "Diet & Lifestyle": "ఆహారం & జీవనశైలి",
    "Health Conditions": "ఆరోగ్య పరిస్థితులు",
    "Create Account": "ఖాతా సృష్టించండి",
    "Check Anemia Risk": "రక్తహీనత ప్రమాదాన్ని తనిఖీ చేయండి",
    "Generative AI Features": "జెనరేటివ్ AI ఫీచర్లు",
    "Step": "దశ",
    "Next": "తదుపరి",
    "Back": "వెనక్కి",
    "Get Started": "ప్రారంభించండి",
    "Login": "లాగిన్",
  },
  Spanish: {
    "Basic Information": "Información básica",
    "Physical Metrics": "Métricas físicas",
    "Diet & Lifestyle": "Dieta y estilo de vida",
    "Health Conditions": "Condiciones de salud",
    "Create Account": "Crear cuenta",
    "Check Anemia Risk": "Comprobar riesgo de anemia",
    "Generative AI Features": "Funciones de IA generativa",
    "Step": "Paso",
    "Next": "Siguiente",
    "Back": "Atrás",
    "Get Started": "Comenzar",
    "Login": "Iniciar sesión",
  },
  Arabic: {
    "Basic Information": "المعلومات الأساسية",
    "Physical Metrics": "المقاييس البدنية",
    "Diet & Lifestyle": "النظام الغذائي ونمط الحياة",
    "Health Conditions": "الحالات الصحية",
    "Create Account": "إنشاء حساب",
    "Check Anemia Risk": "تحقق من خطر فقر الدم",
    "Generative AI Features": "ميزات الذكاء الاصطناعي التوليدي",
    "Step": "خطوة",
    "Next": "التالي",
    "Back": "رجوع",
    "Get Started": "ابدأ",
    "Login": "تسجيل الدخول",
  },
};

export function translate(language: SupportedLanguage, text: string) {
  return translations[language]?.[text] ?? text;
}
