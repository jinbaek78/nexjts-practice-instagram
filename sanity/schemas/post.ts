import { defineArrayMember, defineField, defineType } from 'sanity';
export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'imgUrl',
      title: 'ImageUrl',
      type: 'string',
    }),
    defineField({
      name: 'imgAssetId',
      title: 'ImgAssetId',
      type: 'string',
    }),

    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),

    defineField({
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { type: 'string', name: 'username' },
            { type: 'string', name: 'comment' },
          ],
        }),
      ],
    }),
  ],
});
