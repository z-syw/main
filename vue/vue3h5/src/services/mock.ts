import { request } from '@/utils/request'

// mock
export const mockAPI = () => request('member/collect/', 'get')
