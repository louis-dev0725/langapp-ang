Installation
---

Install:
```
git clone ...
composer install
yii migrate/up --interactive 0
yii rbac/init
```

Create admin user:
```
yii rbac/create-user admin@example.org adminpassword
yii rbac/assign admin@example.org admin
```

Create ordinary user:
```
yii rbac/create-user user@example.org userpassword
```
