<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [shieldbow](./shieldbow.md) &gt; [SummonerSpellManager](./shieldbow.summonerspellmanager.md) &gt; [fetch](./shieldbow.summonerspellmanager.fetch.md)

## SummonerSpellManager.fetch() method

Fetch a spell by its ID. The ID is usually something like Summoner<!-- -->{<!-- -->Spell<!-- -->} For example, for the spell `Flash`<!-- -->, the ID is `SummonerFlash`<!-- -->. But there are a lot of exceptions to this, so it is recommended to use [findByName](./shieldbow.summonerspellmanager.findbyname.md) instead.

<b>Signature:</b>

```typescript
fetch(key: string, options?: {
        force: boolean;
    }): Promise<SummonerSpell>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | string | The ID of the spell to fetch. |
|  options | { force: boolean; } | <i>(Optional)</i> The basic fetching options. |

<b>Returns:</b>

Promise&lt;[SummonerSpell](./shieldbow.summonerspell.md)<!-- -->&gt;
