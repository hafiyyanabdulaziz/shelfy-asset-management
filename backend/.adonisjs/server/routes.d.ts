import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.store': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.store': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'item_photos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folders.index': { paramsTuple?: []; params?: {} }
    'folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'folders.store': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'items.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'item_photos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}