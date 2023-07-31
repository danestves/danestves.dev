import { collection, component, config, fields, NotEditable, singleton } from '@keystatic/core'

import { CloudImagePreview } from '~/components/cloud-image-preview.tsx'

export const componentBlocks = {
	aside: component({
		preview: props => {
			return (
				<div
					style={{
						display: 'flex',
						gap: '0.5rem',
						borderLeft: '3px',
						borderLeftStyle: 'solid',
						borderLeftColor: '#eee',
						paddingLeft: '0.5rem',
					}}
				>
					<NotEditable>{props.fields.icon.value}</NotEditable>
					<div>{props.fields.content.element}</div>
				</div>
			)
		},
		label: 'Aside',
		schema: {
			icon: fields.text({
				label: 'Emoji icon...',
			}),
			content: fields.child({
				kind: 'block',
				placeholder: 'Aside...',
				formatting: {
					inlineMarks: 'inherit',
					softBreaks: 'inherit',
					listTypes: 'inherit',
				},
				links: 'inherit',
			}),
		},
	}),
	'cloud-image': component({
		preview: CloudImagePreview,
		label: 'Cloud image',
		schema: {
			href: fields.text({
				label: 'Href *',
				validation: {
					length: {
						min: 1,
					},
				},
			}),
			alt: fields.text({
				label: 'Alt text',
				description: 'Include an alt text description or leave blank for decorative images',
			}),
			height: fields.text({
				label: 'Height',
				description: 'The intrinsic height of the image, in pixels. Must be an integer without a unit - e.g. 100',
			}),
			width: fields.text({
				label: 'Width',
				description: 'The intrinsic width of the image, in pixels. Must be an integer without a unit - e.g. 100',
			}),
			srcSet: fields.text({
				label: 'Srcset',
				description: 'Optionally override the default srcset',
			}),
			sizes: fields.text({
				label: 'Sizes',
				description: 'Optionally override the default sizes',
			}),
			caption: fields.text({
				label: 'Caption',
				description: 'Optionally add a caption to display in small text below the image',
			}),
		},
		chromeless: false,
	}),
	tags: component({
		preview: props => {
			return (
				<div style={{ display: 'flex', gap: '1rem' }}>
					{props.fields.tags.value.map(tag => (
						<span
							style={{
								border: 'solid 1px #ddd',
								padding: '0.25rem 0.5rem',
								borderRadius: '20px',
								fontSize: '11px',
							}}
						>
							{tag}
						</span>
					))}
				</div>
			)
		},
		label: 'Project',
		schema: {
			tags: fields.multiselect({
				label: 'Project tags',
				options: [
					{ label: 'Local', value: 'Local' },
					{ label: 'Github', value: 'github' },
					{ label: 'New project', value: 'New project' },
					{ label: 'Existing project', value: 'Existing project' },
					{ label: 'Astro', value: 'Astro' },
					{ label: 'Next.js', value: 'Next.js' },
				],
			}),
		},
		chromeless: false,
	}),
	fieldDemo: component({
		preview: props => {
			return <div>{props.fields.field.value}</div>
		},
		label: 'Field demo',
		schema: {
			field: fields.select({
				label: 'Field',
				defaultValue: 'text',
				options: [
					{ label: 'Date', value: 'date' },
					{ label: 'File', value: 'file' },
					{ label: 'Image', value: 'image' },
					{ label: 'Integer', value: 'integer' },
					{ label: 'Multiselect', value: 'multiselect' },
					{ label: 'Select', value: 'select' },
					{ label: 'Slug', value: 'slug' },
					{ label: 'Text', value: 'text' },
					{ label: 'URL', value: 'url' },
				],
			}),
		},
		chromeless: false,
	}),
	embed: component({
		label: 'Embed',
		preview: props => <div>{props.fields.embedCode.value}</div>,
		schema: {
			mediaType: fields.select({
				label: 'Media type',
				options: [
					{ label: 'Video', value: 'video' },
					{ label: 'Tweet', value: 'tweet' },
				],
				defaultValue: 'video',
			}),
			embedCode: fields.text({
				label: 'Embed code',
				multiline: true,
			}),
		},
	}),
}

const formatting = {
	headingLevels: [2, 3],
	blockTypes: true,
	listTypes: true,
	inlineMarks: true,
} as const

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
			entryLayout: 'content',
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
				draft: fields.checkbox({
					label: 'Do not publish',
					description: 'Check this box to prevent this post from being published',
					defaultValue: false,
				}),
				publishedOn: fields.date({
					label: 'Published on',
					validation: {
						isRequired: true,
					},
				}),
				summary: fields.text({
					label: 'Summary',
					description: 'The summary is displayed on the blog list page and also the metadata description.',
					multiline: true,
				}),
				content: fields.document({
					label: 'Content',
					links: true,
					layouts: [[1, 1]],
					dividers: true,
					tables: true,
					componentBlocks,
					formatting,
				}),
			},
		}),
	},
	singletons: {
		settings: singleton({
			label: 'Settings',
			path: 'src/content/_settings',
			schema: {
				something: fields.checkbox({ label: 'Something' }),
				logo: fields.image({ label: 'Logo' }),
			},
		}),
	},
})
