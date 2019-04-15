Installation
---

1\. Clone and install:
```
git clone ...
composer install
```

2\. Create new PostgreSQL database.

3\. Create `config/db-local.php` and change database settings:
```
$db = [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=localhost;port=5432;dbname=__database__',
    'username' => '__user__',
    'password' => '__password__',
    'charset' => 'utf8',
];
```

4\. Migrate database and init rbac.
```
yii migrate/up --interactive 0
yii rbac/init
```

5\. Create admin user:
```
yii rbac/create-user admin@example.org adminpassword
yii rbac/assign admin@example.org admin
```

6\. Create ordinary user:
```
yii rbac/create-user user@example.org userpassword
```

7\. Run it
```
yii serve
```

7\. Open Postman and try it.
