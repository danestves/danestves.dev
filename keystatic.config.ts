import { collection, config, fields, singleton } from '@keystatic/core'

export default config({
	storage: {
		kind: 'github',
		repo: { owner: 'danestves', name: 'danestves.dev' },
	},
	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'content/posts/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						description: 'The title of the post',
					},
					slug: {
						label: 'SEO-friendly slug',
						description: 'This will define the file/folder name for this entry',
					},
				}),
				publishDate: fields.date({ label: 'Publish Date' }),
				heroImage: fields.image({ label: 'Hero Image' }),
				content: fields.document({
					label: 'Content',
					formatting: true,
					dividers: true,
					links: true,
					images: true,
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
