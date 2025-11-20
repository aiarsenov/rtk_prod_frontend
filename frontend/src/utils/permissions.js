/**
 * Утилиты для работы с правами доступа
 */

/**
 * Проверяет наличие права у пользователя
 * @param {Object} user - объект пользователя из Redux store
 * @param {string} section - раздел системы (main, employees, project_reports и т.д.)
 * @param {string} permissionType - тип права (view, edit, delete)
 * @param {string} requiredScope - требуемый уровень доступа ('limited' или 'full')
 * @returns {boolean}
 */
export const hasPermission = (user, section, permissionType = 'view', requiredScope = 'limited') => {
    // В режиме разработки разрешаем все доступы
    if (import.meta.env.MODE === "development") {
        return true;
    }

    if (!user?.permissions) return false;

    const actualScope = user.permissions[section]?.[permissionType];

    if (!actualScope) return false;

    // Если требуется limited, то подходит и limited, и full
    if (requiredScope === 'limited') {
        return actualScope === 'limited' || actualScope === 'full';
    }

    // Если требуется full, то только full
    if (requiredScope === 'full') {
        return actualScope === 'full';
    }

    return false;
};

/**
 * Проверяет, является ли пользователь администратором
 * @param {Object} user - объект пользователя из Redux store
 * @returns {boolean}
 */
export const isAdmin = (user) => {
    return hasPermission(user, 'main', 'view');
};

/**
 * Проверяет доступ к разделу с указанным типом права
 * @param {Object} user - объект пользователя из Redux store
 * @param {string} section - раздел системы
 * @param {string} action - действие (view, edit, delete)
 * @returns {boolean}
 */
export const canAccess = (user, section, action = 'view') => {
    return hasPermission(user, section, action);
};

/**
 * Получает уровень доступа пользователя к разделу
 * @param {Object} user - объект пользователя из Redux store
 * @param {string} section - раздел системы
 * @param {string} permissionType - тип права
 * @returns {string|null} - 'full', 'limited' или null
 */
export const getAccessLevel = (user, section, permissionType = 'view') => {
    return user?.permissions?.[section]?.[permissionType] || null;
};

/**
 * Доступные разделы системы
 */
export const SECTIONS = {
    MAIN: 'main',
    PROJECT_REPORTS: 'project_reports',
    EMPLOYEE_REPORTS: 'employee_reports',
    SALES: 'sales',
    CUSTOMERS: 'customers',
    CONTRACTORS: 'contractors',
    EMPLOYEES: 'employees',
    DICTIONARIES: 'dictionaries',
};

/**
 * Типы прав
 */
export const PERMISSION_TYPES = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete',
};

/**
 * Уровни доступа
 */
export const ACCESS_LEVELS = {
    FULL: 'full',
    LIMITED: 'limited',
};
