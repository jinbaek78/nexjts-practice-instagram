import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'emailName',
      title: 'EmailName',
      type: 'string',
    }),
    defineField({
      name: 'avatarUrl',
      title: 'AvatarUrl',
      type: 'string',
    }),

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
