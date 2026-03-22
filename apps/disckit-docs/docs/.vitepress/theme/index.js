import DefaultTheme from 'vitepress/theme'
import { h, defineComponent } from 'vue'
import { useData, inBrowser } from 'vitepress'
import HomeLayout from './HomeLayout.vue'
import './custom.css'

const Layout = defineComponent({
  setup() {
    const { frontmatter } = useData()
    return () => frontmatter.value.layout === 'disckit-home'
      ? h(HomeLayout)
      : h(DefaultTheme.Layout)
  },
})

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    if (inBrowser) {
      // Vercel Analytics
      import('@vercel/analytics').then(({ inject }) => inject())
      // Vercel Speed Insights
      import('@vercel/speed-insights').then(({ injectSpeedInsights }) => injectSpeedInsights())
    }
  },
}
