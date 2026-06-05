export interface Country {
  code: string;
  name: string;
  nameKo: string;
  flag: string;
  group: string;
  primary: string;
  secondary: string;
  bibImage?: string;
}

export const COUNTRIES: Country[] = [
  // Group A
  { code: "MEX", name: "Mexico", nameKo: "멕시코", flag: "🇲🇽", group: "A", primary: "#006847", secondary: "#ce1126", bibImage: "/img/bibs_mexico.png" },
  { code: "RSA", name: "South Africa", nameKo: "남아공", flag: "🇿🇦", group: "A", primary: "#007749", secondary: "#ffb81c" },
  { code: "KOR", name: "South Korea", nameKo: "대한민국", flag: "🇰🇷", group: "A", primary: "#c1272d", secondary: "#0047a0", bibImage: "/img/bibs_korea.png" },
  { code: "CZE", name: "Czechia", nameKo: "체코", flag: "🇨🇿", group: "A", primary: "#d7141a", secondary: "#11457e" },
  // Group B
  { code: "CAN", name: "Canada", nameKo: "캐나다", flag: "🇨🇦", group: "B", primary: "#ff0000", secondary: "#ffffff" },
  { code: "BIH", name: "Bosnia & Herzegovina", nameKo: "보스니아", flag: "🇧🇦", group: "B", primary: "#002395", secondary: "#fecb00" },
  { code: "QAT", name: "Qatar", nameKo: "카타르", flag: "🇶🇦", group: "B", primary: "#8b1a4a", secondary: "#ffffff" },
  { code: "SUI", name: "Switzerland", nameKo: "스위스", flag: "🇨🇭", group: "B", primary: "#d52b1e", secondary: "#ffffff" },
  // Group C
  { code: "BRA", name: "Brazil", nameKo: "브라질", flag: "🇧🇷", group: "C", primary: "#ffd700", secondary: "#009c3b" },
  { code: "MAR", name: "Morocco", nameKo: "모로코", flag: "🇲🇦", group: "C", primary: "#c1272d", secondary: "#006233" },
  { code: "HAI", name: "Haiti", nameKo: "아이티", flag: "🇭🇹", group: "C", primary: "#00209f", secondary: "#d21034" },
  { code: "SCO", name: "Scotland", nameKo: "스코틀랜드", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", primary: "#003078", secondary: "#ffffff" },
  // Group D
  { code: "USA", name: "United States", nameKo: "미국", flag: "🇺🇸", group: "D", primary: "#002868", secondary: "#bf0a30" },
  { code: "PAR", name: "Paraguay", nameKo: "파라과이", flag: "🇵🇾", group: "D", primary: "#c1272d", secondary: "#ffffff" },
  { code: "AUS", name: "Australia", nameKo: "호주", flag: "🇦🇺", group: "D", primary: "#ffcd00", secondary: "#00843d" },
  { code: "TUR", name: "Turkiye", nameKo: "튀르키예", flag: "🇹🇷", group: "D", primary: "#e30a17", secondary: "#ffffff" },
  // Group E
  { code: "GER", name: "Germany", nameKo: "독일", flag: "🇩🇪", group: "E", primary: "#ffffff", secondary: "#000000", bibImage: "/img/bibs_germany.png" },
  { code: "CUW", name: "Curacao", nameKo: "퀴라소", flag: "🇨🇼", group: "E", primary: "#002b7f", secondary: "#f9e814" },
  { code: "CIV", name: "Ivory Coast", nameKo: "코트디부아르", flag: "🇨🇮", group: "E", primary: "#ff8200", secondary: "#009e49" },
  { code: "ECU", name: "Ecuador", nameKo: "에콰도르", flag: "🇪🇨", group: "E", primary: "#ffd100", secondary: "#034ea2" },
  // Group F
  { code: "NED", name: "Netherlands", nameKo: "네덜란드", flag: "🇳🇱", group: "F", primary: "#ff6600", secondary: "#ffffff" },
  { code: "JPN", name: "Japan", nameKo: "일본", flag: "🇯🇵", group: "F", primary: "#002fa7", secondary: "#ffffff" },
  { code: "SWE", name: "Sweden", nameKo: "스웨덴", flag: "🇸🇪", group: "F", primary: "#006aa7", secondary: "#fecc02" },
  { code: "TUN", name: "Tunisia", nameKo: "튀니지", flag: "🇹🇳", group: "F", primary: "#c1272d", secondary: "#ffffff" },
  // Group G
  { code: "BEL", name: "Belgium", nameKo: "벨기에", flag: "🇧🇪", group: "G", primary: "#c1272d", secondary: "#000000" },
  { code: "EGY", name: "Egypt", nameKo: "이집트", flag: "🇪🇬", group: "G", primary: "#c1272d", secondary: "#ffffff" },
  { code: "IRN", name: "Iran", nameKo: "이란", flag: "🇮🇷", group: "G", primary: "#ffffff", secondary: "#da0000" },
  { code: "NZL", name: "New Zealand", nameKo: "뉴질랜드", flag: "🇳🇿", group: "G", primary: "#ffffff", secondary: "#000000" },
  // Group H
  { code: "ESP", name: "Spain", nameKo: "스페인", flag: "🇪🇸", group: "H", primary: "#c1272d", secondary: "#fbd116" },
  { code: "CPV", name: "Cape Verde", nameKo: "카보베르데", flag: "🇨🇻", group: "H", primary: "#003893", secondary: "#cf2027" },
  { code: "SAU", name: "Saudi Arabia", nameKo: "사우디", flag: "🇸🇦", group: "H", primary: "#006c35", secondary: "#ffffff" },
  { code: "URU", name: "Uruguay", nameKo: "우루과이", flag: "🇺🇾", group: "H", primary: "#75aadb", secondary: "#ffffff" },
  // Group I
  { code: "FRA", name: "France", nameKo: "프랑스", flag: "🇫🇷", group: "I", primary: "#002395", secondary: "#ffffff" },
  { code: "SEN", name: "Senegal", nameKo: "세네갈", flag: "🇸🇳", group: "I", primary: "#ffffff", secondary: "#00853f" },
  { code: "IRQ", name: "Iraq", nameKo: "이라크", flag: "🇮🇶", group: "I", primary: "#ffffff", secondary: "#007a3d" },
  { code: "NOR", name: "Norway", nameKo: "노르웨이", flag: "🇳🇴", group: "I", primary: "#c1272d", secondary: "#002868", bibImage: "/img/bibs_norway.png" },
  // Group J
  { code: "ARG", name: "Argentina", nameKo: "아르헨티나", flag: "🇦🇷", group: "J", primary: "#75aadb", secondary: "#ffffff" },
  { code: "ALG", name: "Algeria", nameKo: "알제리", flag: "🇩🇿", group: "J", primary: "#ffffff", secondary: "#006233" },
  { code: "AUT", name: "Austria", nameKo: "오스트리아", flag: "🇦🇹", group: "J", primary: "#c1272d", secondary: "#ffffff" },
  { code: "JOR", name: "Jordan", nameKo: "요르단", flag: "🇯🇴", group: "J", primary: "#ffffff", secondary: "#007a3d" },
  // Group K
  { code: "POR", name: "Portugal", nameKo: "포르투갈", flag: "🇵🇹", group: "K", primary: "#c1272d", secondary: "#006600" },
  { code: "COD", name: "DR Congo", nameKo: "DR콩고", flag: "🇨🇩", group: "K", primary: "#007fff", secondary: "#ce1021" },
  { code: "UZB", name: "Uzbekistan", nameKo: "우즈베키스탄", flag: "🇺🇿", group: "K", primary: "#1eb53a", secondary: "#0099b5" },
  { code: "COL", name: "Colombia", nameKo: "콜롬비아", flag: "🇨🇴", group: "K", primary: "#fcd116", secondary: "#003893" },
  // Group L
  { code: "ENG", name: "England", nameKo: "잉글랜드", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", primary: "#ffffff", secondary: "#cf081f" },
  { code: "CRO", name: "Croatia", nameKo: "크로아티아", flag: "🇭🇷", group: "L", primary: "#ffffff", secondary: "#ff0000" },
  { code: "GHA", name: "Ghana", nameKo: "가나", flag: "🇬🇭", group: "L", primary: "#ffffff", secondary: "#006b3f" },
  { code: "PAN", name: "Panama", nameKo: "파나마", flag: "🇵🇦", group: "L", primary: "#d52b1e", secondary: "#ffffff" },
];

export const GROUPS = [...new Set(COUNTRIES.map((c) => c.group))];
