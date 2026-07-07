import type { Language } from "@/types/life";
import { hashString } from "@/lib/utils";

export type MotivationTab =
  | "Daily Quote"
  | "Success Story"
  | "Premanand Maharaj Thoughts"
  | "Bhagavad Gita Verse"
  | "Today's Challenge"
  | "Positive Affirmation"
  | "Daily Mission"
  | "Visualization Exercise"
  | "Morning Motivation"
  | "Night Reflection";

export const motivationTabs: MotivationTab[] = [
  "Daily Quote",
  "Success Story",
  "Premanand Maharaj Thoughts",
  "Bhagavad Gita Verse",
  "Today's Challenge",
  "Positive Affirmation",
  "Daily Mission",
  "Visualization Exercise",
  "Morning Motivation",
  "Night Reflection"
];

type MotivationItem = {
  title: string;
  body: string;
};

const english: Record<MotivationTab, MotivationItem[]> = {
  "Daily Quote": [
    { title: "Begin Again", body: "A difficult day is not a verdict. It is a page asking for a braver sentence." },
    { title: "Small Wins", body: "Change becomes real when one small promise is kept quietly, repeatedly, and with love." },
    { title: "Steady Heart", body: "You do not need a perfect mood to move forward. You only need the next honest step." }
  ],
  "Success Story": [
    {
      title: "The Ten-Minute Builder",
      body: "A student who felt behind began with ten focused minutes every morning. Six months later, those minutes had become a skill, a portfolio, and proof that discipline can start gently."
    },
    {
      title: "The Quiet Reset",
      body: "A tired professional replaced late-night scrolling with one written reflection. The first week felt tiny. The second felt clearer. By the third, decisions stopped feeling foggy."
    }
  ],
  "Premanand Maharaj Thoughts": [
    {
      title: "Remember The Inner Seat",
      body: "Sit for a moment with devotion before reacting. A calm remembrance can turn anger into patience and confusion into surrender."
    },
    {
      title: "Clean Intention",
      body: "When the intention is pure, even a small action carries spiritual strength. Do the next duty with humility."
    }
  ],
  "Bhagavad Gita Verse": [
    {
      title: "Karmanye Vadhikaraste",
      body: "You have a right to your action, not to ownership of every result. Work sincerely and let attachment become lighter."
    },
    {
      title: "Balanced Mind",
      body: "A steady mind meets success and difficulty without losing its center. Practice balance in the smallest moments."
    }
  ],
  "Today's Challenge": [
    { title: "One Honest Repair", body: "Fix one small thing you have been postponing: a message, a corner of your room, a task, or an apology." },
    { title: "No Complaint Hour", body: "Spend one hour without complaining. Replace each complaint with one useful action." }
  ],
  "Positive Affirmation": [
    { title: "I Am Returning", body: "I am not lost. I am returning to myself one clear choice at a time." },
    { title: "I Can Practice", body: "I can practice courage, focus, patience, and love today." }
  ],
  "Daily Mission": [
    { title: "Three Priorities", body: "Choose three priorities. Finish the first before negotiating with distraction." },
    { title: "Body And Mind", body: "Drink water, move for ten minutes, and write one sentence that tells the truth." }
  ],
  "Visualization Exercise": [
    { title: "Future Room", body: "Close your eyes and picture tomorrow night. See yourself proud of one completed action. Now name that action." },
    { title: "Calm Self", body: "Imagine your calmest self entering the room. Notice posture, breath, and voice. Borrow that energy for five minutes." }
  ],
  "Morning Motivation": [
    { title: "Open Cleanly", body: "Start the day without asking for permission from yesterday. Make your first action clean and deliberate." },
    { title: "Light First", body: "Let the morning be simple: water, breath, one priority, and a little faith." }
  ],
  "Night Reflection": [
    { title: "Close With Grace", body: "Write what you learned, forgive what was messy, and prepare one gentle win for tomorrow." },
    { title: "Soft Audit", body: "Ask: What gave energy? What drained energy? What will I protect tomorrow?" }
  ]
};

const hindi: Record<MotivationTab, MotivationItem[]> = {
  "Daily Quote": [
    { title: "फिर से शुरू", body: "मुश्किल दिन फैसला नहीं होता, वह नई हिम्मत से लिखे जाने वाला पन्ना होता है।" },
    { title: "छोटी जीत", body: "बदलाव तब दिखता है जब छोटी प्रतिज्ञा रोज प्रेम से निभाई जाती है।" }
  ],
  "Success Story": [
    {
      title: "दस मिनट की शुरुआत",
      body: "एक विद्यार्थी ने हर सुबह सिर्फ दस मिनट पढ़ना शुरू किया। कुछ महीनों बाद वही दस मिनट आदत, कौशल और आत्मविश्वास बन गए।"
    }
  ],
  "Premanand Maharaj Thoughts": [
    { title: "स्मरण", body: "प्रतिक्रिया देने से पहले एक क्षण भक्ति से बैठो। शांत स्मरण क्रोध को धैर्य में बदल सकता है।" }
  ],
  "Bhagavad Gita Verse": [
    { title: "कर्म", body: "तुम्हारा अधिकार कर्म पर है, फल पर आसक्ति पर नहीं। सच्चे मन से कर्म करो।" }
  ],
  "Today's Challenge": [
    { title: "एक सुधार", body: "आज वह एक छोटा काम पूरा करो जिसे तुम टालते आ रहे हो।" }
  ],
  "Positive Affirmation": [
    { title: "मैं सक्षम हूं", body: "मैं हर दिन एक बेहतर, शांत और मजबूत व्यक्ति बन रहा हूं।" }
  ],
  "Daily Mission": [
    { title: "तीन काम", body: "आज के तीन मुख्य काम लिखो और पहला काम पूरी ईमानदारी से पूरा करो।" }
  ],
  "Visualization Exercise": [
    { title: "कल की खुशी", body: "आंखें बंद करके खुद को कल रात एक पूरे हुए काम पर गर्व करते देखो।" }
  ],
  "Morning Motivation": [
    { title: "नई सुबह", body: "आज की शुरुआत साफ मन, पानी, श्वास और एक अच्छे निर्णय से करो।" }
  ],
  "Night Reflection": [
    { title: "शांत समापन", body: "जो सीखा उसे लिखो, जो अधूरा रहा उसे क्षमा करो, और कल की एक जीत तय करो।" }
  ]
};

const gujarati: Record<MotivationTab, MotivationItem[]> = {
  "Daily Quote": [
    { title: "ફરી શરૂઆત", body: "કઠિન દિવસ અંતિમ નિર્ણય નથી; તે વધુ હિંમતથી લખવાનું નવું પાનું છે." },
    { title: "નાની જીત", body: "નાનો સંકલ્પ પ્રેમથી રોજ નિભાવશો તો બદલાવ શાંત રીતે મોટો બનશે." }
  ],
  "Success Story": [
    {
      title: "દસ મિનિટનો માર્ગ",
      body: "એક વિદ્યાર્થીએ દર સવાર દસ મિનિટથી શરૂઆત કરી. થોડા મહિનામાં એ જ સમય કુશળતા અને આત્મવિશ્વાસ બન્યો."
    }
  ],
  "Premanand Maharaj Thoughts": [
    { title: "સ્મરણ", body: "પ્રતિક્રિયા પહેલાં થોડું શાંત સ્મરણ કરો. ભક્તિ મનને ધીરજ તરફ વાળે છે." }
  ],
  "Bhagavad Gita Verse": [
    { title: "કર્મ", body: "તમારો અધિકાર કર્મ પર છે. પરિણામની આસક્તિ હળવી કરીને નિષ્ઠાથી કાર્ય કરો." }
  ],
  "Today's Challenge": [
    { title: "એક સુધારો", body: "આજે તમે ટાળતા આવ્યા છો તે એક નાનું કામ પૂર્ણ કરો." }
  ],
  "Positive Affirmation": [
    { title: "હું સક્ષમ છું", body: "હું દરરોજ વધુ શાંત, મજબૂત અને સ્પષ્ટ બની રહ્યો છું." }
  ],
  "Daily Mission": [
    { title: "ત્રણ કામ", body: "આજના ત્રણ મુખ્ય કામ લખો અને પહેલું કામ પૂર્ણ ધ્યાનથી કરો." }
  ],
  "Visualization Exercise": [
    { title: "કાલની જીત", body: "આંખો બંધ કરીને કાલે રાત્રે પૂર્ણ થયેલા એક કામ પર તમારું ગૌરવ જુઓ." }
  ],
  "Morning Motivation": [
    { title: "નવી સવાર", body: "સવારને પાણી, શ્વાસ, એક પ્રાથમિકતા અને વિશ્વાસથી શરૂ કરો." }
  ],
  "Night Reflection": [
    { title: "શાંત સમાપન", body: "શું શીખ્યા તે લખો, અધૂરું રહેલું છોડો, અને કાલની એક જીત તૈયાર કરો." }
  ]
};

const content: Record<Language, Record<MotivationTab, MotivationItem[]>> = {
  english,
  hindi,
  gujarati
};

export function getDailyMotivation(language: Language, tab: MotivationTab, dateKey: string) {
  const pool = content[language][tab];
  const index = hashString(`${language}:${tab}:${dateKey}`) % pool.length;
  return pool[index];
}

export function dailyBackground(dateKey: string) {
  const gradients = [
    "from-blue-500/24 via-amber-300/20 to-white/50 dark:from-blue-500/18 dark:via-amber-400/10 dark:to-slate-950/60",
    "from-emerald-400/20 via-white/40 to-amber-300/25 dark:from-emerald-500/14 dark:via-slate-900/40 dark:to-amber-500/10",
    "from-rose-300/22 via-orange-200/28 to-blue-200/20 dark:from-rose-500/12 dark:via-orange-400/10 dark:to-blue-500/12",
    "from-violet-300/24 via-white/40 to-sky-200/25 dark:from-violet-500/14 dark:via-slate-950/50 dark:to-sky-500/12"
  ];
  return gradients[hashString(dateKey) % gradients.length];
}
