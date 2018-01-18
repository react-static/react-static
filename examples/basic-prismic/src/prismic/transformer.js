export default function transform (prismicData) {
  const data = prismicData.data
  const result = {}
  const entries = Object.entries(data)

  for (let i = 0; i < entries.length; i += 1) {
    const name = entries[i][0]
    const value = entries[i][1]

    switch (name) {
      case 'title':
      case 'body':
        // The data we want is always on the first child and in the text property
        // Note that in reality the response could be multiple paragraphs,
        // with embedded links, images etc
        // you would need to handle that here
        result[name] = value[0].text
        break

      default:
        result[name] = value
    }
  }
  return result
}

/* SAMPLE RESPONSE FOR A 'POST'
  {
     {
        id: "WmAZTCkAACarLekM"
        uid: "1"
        type: "post"
        href: https://react-static-blog.prismic.io/
        tags: [ ]
        first_publication_date: "2018-01-18T03:52:45+0000"
        last_publication_date: "2018-01-18T03:52:45+0000"
        + … -slugs: []
        linked_documents: [ ]
        lang: "en-us"
        alternate_languages: [ ]
        --data: {
          --post: {
          -id: {
            type: "Number"
            value: 1
          }
        --userid: {
          type: "Number"
          value: 1
        }
      --title: {
        type: "StructuredText"
      --value: [
        --{
          type: "heading1"
          text: "Mark Twain"
          spans: [ ]
        }
        ]
      }
      --body: {
        type: "StructuredText"
        --value: [
        --{
          type: "paragraph"
          text: "Twenty years from now you will be more disappointed..."
          + … -spans: []
      }
    ]
  }
}
}
}
-
*/
