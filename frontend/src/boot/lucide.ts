import { boot } from 'quasar/wrappers';
import { defineComponent, h } from 'vue';
import * as icons from '@lucide/vue';

export default boot(({ app }) => {
  // Create a wrapper component <lucide-icon name="box" />
  const LucideIcon = defineComponent({
    name: 'LucideIcon',
    props: {
      name: {
        type: String,
        required: true,
      },
      size: {
        type: [Number, String],
        default: 24,
      },
      color: {
        type: String,
        default: 'currentColor',
      },
    },
    setup(props) {
      return () => {
        // Convert kebab-case to PascalCase for icon name
        const componentName = props.name
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');
        const iconComponent = (icons as Record<string, unknown>)[componentName];

        if (!iconComponent) {
          console.warn(`Lucide icon "${props.name}" not found.`);
          return h('span');
        }

        return h(iconComponent, {
          size: props.size,
          color: props.color,
          strokeWidth: 1.5,
        });
      };
    },
  });

  app.component('lucide-icon', LucideIcon);
});
