/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
  }
  folders: {
    index: typeof routes['folders.index']
    store: typeof routes['folders.store']
    show: typeof routes['folders.show']
    update: typeof routes['folders.update']
    destroy: typeof routes['folders.destroy']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    show: typeof routes['categories.show']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
  items: {
    index: typeof routes['items.index']
    store: typeof routes['items.store']
    show: typeof routes['items.show']
    update: typeof routes['items.update']
    destroy: typeof routes['items.destroy']
  }
  itemPhotos: {
    destroy: typeof routes['item_photos.destroy']
  }
}
