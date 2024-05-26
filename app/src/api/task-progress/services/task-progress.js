'use strict';

/**
 * task-progress service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::task-progress.task-progress');
