<?php

namespace app\commands;

use app\models\User;
use yii\console\Controller;
use yii\console\ExitCode;
use yii\helpers\Console;
use yii\rbac\Role;

class RbacController extends Controller
{
    /** @var \yii\rbac\ManagerInterface */
    protected $am;
    /** @var User|null */
    protected $user;
    /** @var Role|null */
    protected $role;

    public function init()
    {
        parent::init();
        $this->am = \Yii::$app->authManager;
    }

    public function actionInit()
    {
        echo $this->ansiFormat('rbac/init is deprecated. To add roles just run ./yii migrate-data', Console::FG_RED);
    }

    public function actionCreateUser($email, $password)
    {
        $user = new User();
        $user->scenario = User::SCENARIO_ADMIN;
        $user->email = $email;
        $user->password = $password;
        if ($user->save()) {
            echo $this->ansiFormat('User was successfully created.', Console::FG_GREEN);
        } else {
            echo $this->ansiFormat('User was not created. Probably it\'s already exists.', Console::FG_RED);
        }
    }

    public function actionAssign($email = null, $role = null)
    {
        if ($email != null) {
            $this->user = User::findByEmail($email);
            if ($this->user == null) {
                echo $this->ansiFormat('User with such E-mail was not found. ', Console::FG_RED);
            }
        }
        if ($role != null) {
            $this->role = $this->am->getRole($role);
            if ($this->role == null) {
                echo $this->ansiFormat('Such role doesn\'t exists. ', Console::FG_RED);
            }
        }
        if ($this->user == null || $this->role == null) {
            $this->promptParams();
        }
        $am = $this->am;
        foreach ($am->getRolesByUser($this->user->id) as $userRole) {
            if ($userRole->name == $this->role->name) {
                echo $this->ansiFormat('User already has role ' . $this->role->name, Console::FG_PURPLE);

                return ExitCode::UNSPECIFIED_ERROR;
            }
        }

        $this->am->assign($this->role, $this->user->id);
        echo $this->ansiFormat('Role was successfully added', Console::FG_GREEN);

        return ExitCode::OK;
    }

    /**
     * Удалить роль у пользователю
     */
    public function actionRevoke()
    {
        $this->promptParams();
        $this->am->revoke($this->role, $this->user->id);
        echo $this->ansiFormat('Role was successfully deleted', Console::FG_GREEN);

        return ExitCode::OK;
    }

    protected function promptParams()
    {
        if ($this->user == null) {
            $this->prompt($this->ansiFormat('Enter user E-mail:', Console::FG_BLUE), [
                'required' => true, 'validator' => function ($input, &$error) {
                    if (($this->user = User::findByEmail($input)) === null) {
                        $error = $this->ansiFormat('User with such E-mail was not found', Console::FG_RED);

                        return false;
                    }

                    return true;
                },
            ]);
        }

        if ($this->role == null) {
            $this->prompt($this->ansiFormat('Enter role to assign:', Console::FG_BLUE), [
                'required' => true, 'validator' => function ($input, &$error) {
                    if (($this->role = $this->am->getRole($input)) === null) {
                        $roles = array_map(function ($role) {
                            /** @var Role $role */
                            return $role->name;
                        }, $this->am->getRoles());
                        $error = $this->ansiFormat('Such role doesn\'t exists.', Console::FG_RED)
                            . $this->ansiFormat('Available roles: ' . implode(', ', $roles), Console::FG_YELLOW);

                        return false;
                    }

                    return true;
                },
            ]);
        }
    }
}
