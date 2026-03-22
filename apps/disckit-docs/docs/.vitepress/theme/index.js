import DefaultTheme from 'vitepress/theme'
import { h, defineComponent } from 'vue'
import { useData } from 'vitepress'
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
}
