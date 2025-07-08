import { library } from '@fortawesome/fontawesome-svg-core'
import { config } from '@fortawesome/fontawesome-svg-core'
import {
  faVideo,
  faYenSign,
  faScissors,
  faClock,
  faChartLine,
  faGamepad,
  faEye,
  faArrowRight,
  faHeart,
  faBriefcase,
  faShare,
  faStar,
  faUsers,
  faRobot,
  faCalculator,
  faInfoCircle,
  faChartBar,
  faUpload,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import {
  faXTwitter,
  faLine,
  faYoutube,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'

// Font Awesomeの自動CSS追加を無効化（Next.jsでは手動で管理）
config.autoAddCss = false

// 使用するアイコンをライブラリに追加
library.add(
  // Solid icons
  faVideo,
  faYenSign,
  faScissors,
  faClock,
  faChartLine,
  faGamepad,
  faEye,
  faArrowRight,
  faHeart,
  faBriefcase,
  faShare,
  faStar,
  faUsers,
  faRobot,
  faCalculator,
  faInfoCircle,
  faChartBar,
  faUpload,
  faDownload,
  // Brand icons
  faXTwitter,
  faLine,
  faYoutube,
  faInstagram
)

// アイコンが正しく登録されているかデバッグ用
if (typeof window !== 'undefined') {
  console.log('FontAwesome library loaded')
}