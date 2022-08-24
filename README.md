# Sanity Pills

[![Latest version](https://img.shields.io/npm/v/sanity-pills?label=version&color=brightGreen&logo=npm)](https://www.npmjs.com/package/sanity-pills)
![Dependency status](https://img.shields.io/librariesio/release/npm/sanity-pills)
[![Open issues](https://img.shields.io/github/issues/coreyward/sanity-pills)](https://github.com/coreyward/sanity-pills/issues)

A collection of utilities formulated to provide positive experiences in the
Sanity Studio.

> Note: these pills are non-prescription—use them as they fit your needs and
> ignore them as they don’t!

## Pills

Documentation on each of the utilities provided follow.

### Authoring fields with objects

The `fields` helper allows authoring of field schemas in a more succinct,
scannable manner. By way of example:

```js
import { fields } from "sanity-pills"

{
  name: "example",
  type: "object",
  fields: fields({
    // a required string
    name: { required: true },

    // an optional number
    age: {
      type: "number",
    },

    // a string that is only required when `age` is below 18
    guardianName: {
      required: ({ parent }) => parent.age < 18,
    },
  }),
}
```

This pill will use the object key as the name of the field, and if no title is
provided in the value definition, a title will be inferred from the name
(similar to default Sanity Studio behavior, less the warnings).

This behaves more or less expected, converting the object into an array with the
one notable callout being that `required` relies on the `validation` property on
the field and specifying `validation` explicitly will override the `required`
functionality (i.e. Sanity Pills will not merge them).

### Validated image fields

There are no built-in validators for image dimensions in the Sanity Studio, but
these are often valuable. It is straightforward enough to parse the image
dimensions out of the image `_id` field, but Sanity Pills can handle this for
you.

```js
import { createImageField, fields } from "sanity-pills"

export default {
  name: "example",
  type: "document",
  fields: fields({
    headshot: createImageField({
      validations: {
        required: true,
        minWidth: 500,
        minHeight: 500,
      },
      warnings: {
        minWidth: 1000,
        minHeight: 1000,
      },
    }),
  }),
}
```

This example illustrates a required headshot image that will be invalid unless
the original image dimensions are at minimum 500x500. It also shows a warning
message suggesting that the best results would be achieved with an image of
1000x1000 when either of the original dimensions is smaller.

This pill also supports validations of `maxWidth` and `maxHeight`, though they
are less likely to be required.

On a related note, Sanity Pills also exposes the function used to parse a Sanity
asset ID as `decodeAssetId`. It's documented later in this document.

### Slugs representing URL paths

If you happen to want your slugs to be valid URL paths, complete with the
initial slash and a trailing slash, possibly with a required prefix, while
supporting the “generate” button, you might appreciate this pill—it does just
that.

It enforces the following rules:

1. Slugs are required
2. Slugs must start with `/`
3. Slugs must end with `/`
4. The first non-slash character has to be a letter, except when the slug is
   `/404/`
5. Slugs have to be lowercase alphanumeric characters, plus hyphens and forward
   slashes
6. If the `prefix` option is supplied to `createSlugField`, the slug must begin
   with `/<prefix>/`

Here's are a couple examples:

```js
import { createSlugField, fields } from "sanity-pills"

export default {
  name: "example",
  type: "document",
  fields: fields({
    // optional string field
    name: {},

    // slug with a “generate” button that sources from name
    slug: createSlugField({ source: "name" }),

    // produces a prefixed URL like /blog/hello/ and validates
    // that the prefixes is included as expected
    scopedSlug: createSlugField({
      prefix: "blog",
      source: "name",
    }),
  }),
}
```

You can use an async function for `source` (it's passed through unchanged), but
for now `prefix` only supports static string values.

Oh, and if you want to roll your own slug but want a handy `slugify` routine,
you can use `createSlug` from the Sanity Pills package. E.g.:

```js
import { createSlug } from "sanity-pills"

export default {
  // …
  slug: {
    type: "slug",
    options: {
      source: "name",
      slugify: createSlug,
    },
    required: true,
  },
}
```

### Validating block content

Portable Text is a powerful way for editors to author non-trivial, rich data
structures in a platform agnostic way, but it's easy to wind up with
poor-quality content represented impeccably. As an array of nested blocks,
enforcing common things like no trailing whitespace, links always having
associated URLS, or even just that real content is provided can be cumbersome.

This pill makes validating Portable Text fields easier by including common
validation patterns out of the box and supporting custom extensions.

Sanity Pills ships with two built in block validators ready to use: `all` and
`optional`. Both of these enforce the following validations, and `all` also
enforces the presence of a value for the field.

1. **No empty blocks**: an empty paragraph, for example
2. **No newlines**: prevents single blocks (rendered as <p> tags) by default
   from containing newlines (rendered as <br /> tags)
3. **No terminating whitespace**: disallows spaces at the beginning or end of a
   block
4. **No missing links**: links must have a valid `href` property
5. **No unstyled blocks**: each block needs a `style` set (e.g. `normal` or
   `h1`)
6. **No stacked marks**: disallows having text that is bold and italic or italic
   and strikethrough, etc. while allowing stacking of custom marks
7. **No marks on headings**: disallows any marks to be used on blocks with a
   style starting with `h`

If you’re happy with this list, you can use either of the default block
validators like so:

```js
import { defaultBlockValidators } from "sanity-pills"

{
  type: "array",
  of: [{ type: "block" }],
  validation: defaultBlockValidators.all, // or .optional
}
```

It's entirely likely that this very opinionated set of validations is not
entirely suitable for your use case, or that you need to add an additional
custom validator to the list. Not to worry, that's possible like so:

```js
import { createBlockValidator } from "sanity-pills"

const yourValidator = createBlockValidator({
  // enable a couple of the built in validations
  noEmptyBlocks: true,
  validateLinks: true,

  // add a custom validation that only allows heading blocks
  noTextAllowed: (blocks) => {
    const errorPaths = (blocks || [])
      .filter(
        (block) =>
          block._type === "block" &&
          block.style.match(/^h[1-6]$/)
      )
      .map((block, index) => [{ _key: block._key }] || [index])

    return (
      errorPaths.length === 0 || {
        message: "Must be styled as a heading",
        paths: errorPaths,
      }
    )
  }
})

// use your validator like so
{
  type: "array",
  of: [{ type: "block" }],
  validation: yourValidator,
}
```

### Using Portable Text in a preview

Since block content is stored as an array, you can't use it directly when
customizing previews. Instead you have to convert it to a string, but ignore
everything that isn't readily convertible to a string. That's what
`blockPreview` does:

```js
import { blockPreview } from "sanity-pills"

export default {
  // …
  preview: {
    select: {
      title: "title",
      copy: "copy",
    },
    prepare: ({ title, copy }) => ({
      title,
      subtitle: blockPreview(copy),
    }),
  },
}
```

### Parsing an asset ID

Sanity assigns stable, informative IDs for asset uploads, including the format
and, for images, the dimensions of the original file. These can be easily parsed
using the `decodeAssetId` export from Sanity Pills.

```js
import { decodeAssetId } from "sanity-pills"

const {
  dimensions: { width, height },
  format,
} = decodeAssetId(someImageAssetId)
```

### Preventing duplicates in arrays of references

Arrays of references are pretty common, and the usual cases for them typically
only expect a single instance of any selected document. This wee routine
enhances the experience of choosing references by removing any documents that
are already in the array.

```js
import { noDuplicateRefs } from "sanity-pills"

const field = {
  type: "array",
  of: [
    {
      type: "reference",
      to: [{ type: "someDocumentType" }],
      options: {
        filter: noDuplicateRefs,
      },
    },
  ],
}
```

### Joining path segments into a slash-delimited URL

Typical path joining routine that prevents doubling up slashes but won't remove
doubled slashes in a string you pass in.

```js
import { urlJoin } from "sanity-pills"

urlJoin("/foo/", "/bar/") // #=> "/foo/bar/"
urlJoin("foo", "bar") // #=> "foo/bar"
urlJoin("/f/o/o/", "/b/a/r/") // #=> "/f/o/o/b/a/r/"
urlJoin("/", "/", "/", "/", "/") // #=> "/"
```

## License

Copyright ©2022 Corey Ward. Available under the [MIT License](https://github.com/coreyward/sanity-pills/blob/master/LICENSE).
