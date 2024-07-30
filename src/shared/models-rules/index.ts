import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  console.log('getUserIdFromRequest', request.user);
  return request.user && request.user.id;
}

export function getOrderIdFromRequest(request: AppRequest): string {
  return '2ca2a8dd-0e18-4a74-baac-9f56a3af4932';
}
