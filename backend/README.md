# BlogAPI

# Updating Prisma Client

Run these commands in order:

```bash
npx prisma migrate dev --name describe_your_changes
```

This will:

1. Create a migration file
2. Apply it to your database
3. Regenerate your Prisma Client automatically

If you **only** want to regenerate the client without changing the database:

```bash
npx prisma generate
```

The first command is what you need after schema changes. Give it a descriptive name like `add_author_relation` or `create_users_table`.
