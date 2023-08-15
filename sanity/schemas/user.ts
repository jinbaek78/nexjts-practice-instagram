import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'users',
  title: 'Users',
  type: 'document',
  fields: [
    defineField({
      name: 'followers',
      title: 'Followers',
      type: 'number',
    }),
    defineField({
      name: 'following',
      title: 'Following',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          name: 'followingUser',
        }),
      ],
    }),

    defineField({
      name: 'marked',
      title: 'Marked',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          name: 'postId',
        }),
      ],
    }),

    defineField({
      name: 'liked',
      title: 'Liked',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          name: 'postId',
        }),
      ],
    }),

    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          name: 'postId',
        }),
      ],
    }),
  ],
});
