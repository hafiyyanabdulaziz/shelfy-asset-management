/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'folders.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folders.index']['types'],
  },
  'folders.store': {
    methods: ["POST"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folders.store']['types'],
  },
  'folders.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.show']['types'],
  },
  'folders.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.update']['types'],
  },
  'folders.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folders.destroy']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.show']['types'],
  },
  'categories.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'items.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/items',
    tokens: [{"old":"/api/v1/items","type":0,"val":"api","end":""},{"old":"/api/v1/items","type":0,"val":"v1","end":""},{"old":"/api/v1/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.index']['types'],
  },
  'items.store': {
    methods: ["POST"],
    pattern: '/api/v1/items',
    tokens: [{"old":"/api/v1/items","type":0,"val":"api","end":""},{"old":"/api/v1/items","type":0,"val":"v1","end":""},{"old":"/api/v1/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.store']['types'],
  },
  'items.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.show']['types'],
  },
  'items.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.update']['types'],
  },
  'items.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.destroy']['types'],
  },
  'item_photos.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/item-photos/:id',
    tokens: [{"old":"/api/v1/item-photos/:id","type":0,"val":"api","end":""},{"old":"/api/v1/item-photos/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/item-photos/:id","type":0,"val":"item-photos","end":""},{"old":"/api/v1/item-photos/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['item_photos.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
