---
title: AccountManager
description: An account manager - to fetch and manage all the RIOT accounts.
---

## AccountManager class

An account manager - to fetch and manage all the RIOT accounts.

**Signature:**

```ts
export declare class AccountManager implements BaseManager<Account> 
```

Implements: BaseManager<Account\>

**References:** [BaseManager](/shieldbow/api/BaseManager.md), [Account](/shieldbow/api/Account.md)

---

### Constructor

```ts
new AccountManager (client: Client)
```

Constructs a new instance of the `AccountManager` class.

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| client | [Client](/shieldbow/api/Client.md) |  |
---

### Properties

#### cache

The accounts cached in the memory.



**Type**: [Collection](https://discord.js.org/#/docs/collection/stable/class/Collection) \< [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [Account](/shieldbow/api/Account.md) \>

---

#### client

The client this accounts manager belongs to.



**Type**: [Client](/shieldbow/api/Client.md)

---

### Methods

#### .fetch (id, options)

Fetch a RIOT account by its unique PUUID.




**Signature:**

```ts
fetch(id: string, options?: {
        force: boolean;
    }): Promise<Account>;
```

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| id | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The PUUID of the RIOT account. |
| options | {         force: boolean;     } | The basic fetching options. |

**Return type**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) \< [Account](/shieldbow/api/Account.md) \>

---

#### .fetchByNameAndTag (name, tag, options)

Fetch a RIOT account by its name and tag.




**Signature:**

```ts
fetchByNameAndTag(name: string, tag: string, options?: {
        force: boolean;
    }): Promise<Account>;
```

**Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The name of this RIOT account. |
| tag | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The tag of this RIOT account. |
| options | {         force: boolean;     } | The basic fetching options. |

**Return type**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) \< [Account](/shieldbow/api/Account.md) \>

---
