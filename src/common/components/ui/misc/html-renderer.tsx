export default function HTMLRenderer({ html }: { html: string }) {
	return <div dangerouslySetInnerHTML={{ __html: html }} />
}
