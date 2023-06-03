import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
	storage: {
		kind: 'github',
		repo: { owner: 'danestves', name: 'danestves.dev' },
	},
	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'slug',
			schema: {
				title: fields.text({ label: 'Title' }),
				slug: fields.text({
					label: 'Slug',
					validation: { length: { min: 4 } },
				}),
				publishDate: fields.date({ label: 'Publish Date' }),
				heroImage: fields.image({ label: 'Hero Image' }),
				content: fields.document({
					label: 'Content',
					formatting: true,
					dividers: true,
					links: true,
				}),
			},
		}),
	},
	singletons: {
		settings: singleton({
			label: 'Settings',
			schema: {
				something: fields.checkbox({ label: 'Something' }),
				logo: fields.image({ label: 'Logo' }),
			},
		}),
	},
})
