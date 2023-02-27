import request from '@/utils/request'

// 查询企业的部门列表
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 根据id查询部门详情，用来做数据回填
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
