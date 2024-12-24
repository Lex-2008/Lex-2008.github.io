title=space 1d 0: idea
uuid=73df977a-d405-4dee-a3e6-e9ca35fc0e0b
PROCESSOR=Markdown.pl
intro=Game about space which will be more fun to make than to play.
tags=space1d
created=2018-04-01

Being inspired by UI of [game about paperclips][p], story behind [Dwarf Fortress][df], and warm memories of playing [Space Trader][st],
I decided to try to make a _game about space_ with as simple UI as possible.
So far the idea is like this: you fly in some unspecified direction (no need to have maps!),
meet other ships, and trade/fight with them.

[p]: https://www.decisionproblem.com/paperclips/index2.html
[df]: https://en.wikipedia.org/wiki/Dwarf_Fortress
[st]: https://en.wikipedia.org/wiki/Space_Trader_(Palm_OS)

Each ship will be presented in UI as two lists - of components and cargo, like this:

<div>
<style>
.ship {display:inline-block; width:300px}
.compact:checked ~ ul:not(.compact) {display:none}
.compact:not(:checked) ~ ul.compact {display:none}
</style>
<fieldset class="ship">
        <legend>Ship</legend>
        <ul>
                <li>Components (<span class="components-count">15</span> total):
                        <input type="checkbox" class="compact" id="components-compact"><label for="components-compact">(compact)</label>
                        <ul class="compact">
                                <li>Head</li>
                                <li>Engine x5</li>
                                <li>Gun x3</li>
                                <li>Cargo bay x4</li>
                        </ul>
                        <ul>
                                <li>Head</li>
                                <li>Engine</li>
                                <li>Engine</li>
                                <li>Engine</li>
                                <li>Engine</li>
                                <li>Engine</li>
                                <li>Gun</li>
                                <li>Gun</li>
                                <li>Gun</li>
                                <li>Cargo bay</li>
                                <li>Cargo bay</li>
                                <li>Cargo bay</li>
                                <li>Cargo bay</li>
                        </ul>
                </li>
                <li>Cargo (<span class="cargo-count">16</span> total, <span class="cargo-free">4</span> free):
                        <input type="checkbox" class="compact" id="cargo-compact"><label for="cargo-compact">(compact)</label>
                        <ul class="compact">
                                <li>Fuel x6</li>
                                <li>Rocket x6</li>
                        </ul>
                        <ul>
                                <li>Fuel</li>
                                <li>Fuel</li>
                                <li>Fuel</li>
                                <li>Fuel</li>
                                <li>Fuel</li>
                                <li>Fuel</li>
                                <li>Rocket</li>
                                <li>Rocket</li>
                                <li>Rocket</li>
                                <li>Rocket</li>
                                <li>Rocket</li>
                                <li>Rocket</li>
                        </ul>
                </li>
        </ul>
</fieldset
</div>

By clicking the "(compact)" checkbox you can switch between
compact view (which shows only count of each component)
and
full view (which shows list of components as is)

Next step is to add a second ship and some combat.

