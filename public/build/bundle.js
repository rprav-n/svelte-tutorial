
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.57.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\AddPersonForm.svelte generated by Svelte v3.57.0 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\AddPersonForm.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let form;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let label0;
    	let t5;
    	let input2;
    	let t6;
    	let br0;
    	let t7;
    	let input3;
    	let t8;
    	let br1;
    	let t9;
    	let input4;
    	let t10;
    	let br2;
    	let t11;
    	let label1;
    	let t13;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t18;
    	let button;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[8][0]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Add a new person";
    			t1 = space();
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			label0 = element("label");
    			label0.textContent = "Skills:";
    			t5 = space();
    			input2 = element("input");
    			t6 = text(" fighting ");
    			br0 = element("br");
    			t7 = space();
    			input3 = element("input");
    			t8 = text(" sneaking ");
    			br1 = element("br");
    			t9 = space();
    			input4 = element("input");
    			t10 = text(" running ");
    			br2 = element("br");
    			t11 = space();
    			label1 = element("label");
    			label1.textContent = "Belt Color";
    			t13 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "black";
    			option1 = element("option");
    			option1.textContent = "red";
    			option2 = element("option");
    			option2.textContent = "yellow";
    			option3 = element("option");
    			option3.textContent = "brown";
    			t18 = space();
    			button = element("button");
    			button.textContent = "Add person";
    			add_location(h3, file$3, 32, 4, 659);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "name");
    			attr_dev(input0, "name", "name");
    			add_location(input0, file$3, 34, 8, 746);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "age");
    			attr_dev(input1, "name", "age");
    			add_location(input1, file$3, 35, 8, 824);
    			add_location(label0, file$3, 37, 8, 904);
    			attr_dev(input2, "type", "checkbox");
    			input2.__value = "fighting";
    			input2.value = input2.__value;
    			add_location(input2, file$3, 42, 8, 1158);
    			add_location(br0, file$3, 42, 78, 1228);
    			attr_dev(input3, "type", "checkbox");
    			input3.__value = "sneaking";
    			input3.value = input3.__value;
    			add_location(input3, file$3, 43, 8, 1242);
    			add_location(br1, file$3, 43, 78, 1312);
    			attr_dev(input4, "type", "checkbox");
    			input4.__value = "running";
    			input4.value = input4.__value;
    			add_location(input4, file$3, 44, 8, 1326);
    			add_location(br2, file$3, 44, 76, 1394);
    			add_location(label1, file$3, 46, 8, 1410);
    			option0.__value = "black";
    			option0.value = option0.__value;
    			add_location(option0, file$3, 48, 12, 1490);
    			option1.__value = "red";
    			option1.value = option1.__value;
    			add_location(option1, file$3, 49, 12, 1540);
    			option2.__value = "yellow";
    			option2.value = option2.__value;
    			add_location(option2, file$3, 50, 12, 1586);
    			option3.__value = "brown";
    			option3.value = option3.__value;
    			add_location(option3, file$3, 51, 12, 1638);
    			if (/*beltColor*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file$3, 47, 8, 1445);
    			add_location(button, file$3, 54, 8, 1705);
    			add_location(form, file$3, 33, 4, 690);
    			add_location(div, file$3, 31, 0, 648);
    			binding_group.p(input2, input3, input4);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			set_input_value(input1, /*age*/ ctx[2]);
    			append_dev(form, t3);
    			append_dev(form, label0);
    			append_dev(form, t5);
    			append_dev(form, input2);
    			input2.checked = ~(/*skills*/ ctx[3] || []).indexOf(input2.__value);
    			append_dev(form, t6);
    			append_dev(form, br0);
    			append_dev(form, t7);
    			append_dev(form, input3);
    			input3.checked = ~(/*skills*/ ctx[3] || []).indexOf(input3.__value);
    			append_dev(form, t8);
    			append_dev(form, br1);
    			append_dev(form, t9);
    			append_dev(form, input4);
    			input4.checked = ~(/*skills*/ ctx[3] || []).indexOf(input4.__value);
    			append_dev(form, t10);
    			append_dev(form, br2);
    			append_dev(form, t11);
    			append_dev(form, label1);
    			append_dev(form, t13);
    			append_dev(form, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*beltColor*/ ctx[1], true);
    			append_dev(form, t18);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[9]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[10]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[4]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*age*/ 4 && to_number(input1.value) !== /*age*/ ctx[2]) {
    				set_input_value(input1, /*age*/ ctx[2]);
    			}

    			if (dirty & /*skills*/ 8) {
    				input2.checked = ~(/*skills*/ ctx[3] || []).indexOf(input2.__value);
    			}

    			if (dirty & /*skills*/ 8) {
    				input3.checked = ~(/*skills*/ ctx[3] || []).indexOf(input3.__value);
    			}

    			if (dirty & /*skills*/ 8) {
    				input4.checked = ~(/*skills*/ ctx[3] || []).indexOf(input4.__value);
    			}

    			if (dirty & /*beltColor*/ 2) {
    				select_option(select, /*beltColor*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddPersonForm', slots, []);
    	let name;
    	let beltColor;
    	let age;

    	// let fighting = false;
    	// let sneaking = false;
    	// let running = false;
    	let skills = [];

    	const handleSubmit = () => {
    		// console.log(name, beltColor, age, fighting, sneaking, running);
    		console.log(name, beltColor, age, skills, beltColor);

    		const friend = { name, beltColor, age, id: Math.random() };
    		dispatch('addFriend', friend);
    	};

    	let dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<AddPersonForm> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		age = to_number(this.value);
    		$$invalidate(2, age);
    	}

    	function input2_change_handler() {
    		skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(3, skills);
    	}

    	function input3_change_handler() {
    		skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(3, skills);
    	}

    	function input4_change_handler() {
    		skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(3, skills);
    	}

    	function select_change_handler() {
    		beltColor = select_value(this);
    		$$invalidate(1, beltColor);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		name,
    		beltColor,
    		age,
    		skills,
    		handleSubmit,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('beltColor' in $$props) $$invalidate(1, beltColor = $$props.beltColor);
    		if ('age' in $$props) $$invalidate(2, age = $$props.age);
    		if ('skills' in $$props) $$invalidate(3, skills = $$props.skills);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		beltColor,
    		age,
    		skills,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		select_change_handler
    	];
    }

    class AddPersonForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddPersonForm",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Modal.svelte generated by Svelte v3.57.0 */

    const file$2 = "src\\Modal.svelte";
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (13:0) {#if showModal}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const title_slot_template = /*#slots*/ ctx[4].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[3], get_title_slot_context);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*message*/ ctx[0]);
    			t1 = space();
    			if (title_slot) title_slot.c();
    			t2 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "modal svelte-1vgb2k5");
    			add_location(div0, file$2, 15, 8, 534);
    			attr_dev(div1, "class", "backdrop svelte-1vgb2k5");
    			toggle_class(div1, "promo", /*isPromo*/ ctx[2]);
    			add_location(div1, file$2, 14, 4, 466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);

    			if (title_slot) {
    				title_slot.m(div0, null);
    			}

    			append_dev(div0, t2);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", self(/*click_handler*/ ctx[5]), false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*message*/ 1) set_data_dev(t0, /*message*/ ctx[0]);

    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[3], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*isPromo*/ 4) {
    				toggle_class(div1, "promo", /*isPromo*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (title_slot) title_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(13:0) {#if showModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showModal*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showModal*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showModal*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['title','default']);
    	let { message = "Default value" } = $$props;
    	let { showModal = false } = $$props;
    	let { isPromo = false } = $$props;
    	const writable_props = ['message', 'showModal', 'isPromo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('showModal' in $$props) $$invalidate(1, showModal = $$props.showModal);
    		if ('isPromo' in $$props) $$invalidate(2, isPromo = $$props.isPromo);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ message, showModal, isPromo });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('showModal' in $$props) $$invalidate(1, showModal = $$props.showModal);
    		if ('isPromo' in $$props) $$invalidate(2, isPromo = $$props.isPromo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, showModal, isPromo, $$scope, slots, click_handler];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { message: 0, showModal: 1, isPromo: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get message() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPromo() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPromo(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Tutorial.svelte generated by Svelte v3.57.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\Tutorial.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (70:2) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "There are no friends....";
    			add_location(div, file$1, 70, 2, 1713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(70:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:3) {#if friend.beltColor === "black"}
    function create_if_block_1(ctx) {
    	let strong;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			strong.textContent = "MASTER";
    			add_location(strong, file$1, 64, 4, 1526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(64:3) {#if friend.beltColor === \\\"black\\\"}",
    		ctx
    	});

    	return block;
    }

    // (61:1) {#each friends as friend (friend.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let h4;
    	let t0_value = /*friend*/ ctx[14].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*friend*/ ctx[14].age + "";
    	let t3;
    	let t4;
    	let t5_value = /*friend*/ ctx[14].beltColor + "";
    	let t5;
    	let t6;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block = /*friend*/ ctx[14].beltColor === "black" && create_if_block_1(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*friend*/ ctx[14]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = text(" years old, ");
    			t5 = text(t5_value);
    			t6 = text(" belt.");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Delete";
    			add_location(h4, file$1, 62, 3, 1459);
    			add_location(p, file$1, 66, 3, 1564);
    			add_location(button, file$1, 67, 3, 1624);
    			set_style(div, "color", /*friend*/ ctx[14].beltColor);
    			set_style(div, "border", "1px solid black");
    			set_style(div, "margin", "1rem 0rem");
    			add_location(div, file$1, 61, 2, 1372);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(div, t7);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*friends*/ 1 && t0_value !== (t0_value = /*friend*/ ctx[14].name + "")) set_data_dev(t0, t0_value);

    			if (/*friend*/ ctx[14].beltColor === "black") {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*friends*/ 1 && t3_value !== (t3_value = /*friend*/ ctx[14].age + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*friends*/ 1 && t5_value !== (t5_value = /*friend*/ ctx[14].beltColor + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*friends*/ 1) {
    				set_style(div, "color", /*friend*/ ctx[14].beltColor);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(61:1) {#each friends as friend (friend.id)}",
    		ctx
    	});

    	return block;
    }

    // (76:1) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*num*/ ctx[6]}`;
    			attr_dev(h1, "class", "svelte-1tky8bj");
    			add_location(h1, file$1, 76, 2, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(76:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:1) {#if num > 20}
    function create_if_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*num*/ ctx[6]} greater than 20`;
    			attr_dev(h1, "class", "svelte-1tky8bj");
    			add_location(h1, file$1, 74, 2, 1781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(74:1) {#if num > 20}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let input0;
    	let t5;
    	let input1;
    	let t6;
    	let input2;
    	let t7;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t8;
    	let mounted;
    	let dispose;
    	let each_value = /*friends*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*friend*/ ctx[14].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*num*/ ctx[6] > 20) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			p = element("p");
    			t0 = text(/*fullName*/ ctx[4]);
    			t1 = text(" : ");
    			t2 = text(/*beltColor*/ ctx[1]);
    			t3 = text(" belt");
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			input2 = element("input");
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t8 = space();
    			if_block.c();
    			add_location(p, file$1, 50, 1, 1038);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$1, 51, 1, 1077);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$1, 52, 1, 1122);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$1, 53, 1, 1166);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file$1, 38, 0, 627);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(main, t4);
    			append_dev(main, input0);
    			set_input_value(input0, /*firstName*/ ctx[2]);
    			append_dev(main, t5);
    			append_dev(main, input1);
    			set_input_value(input1, /*lastName*/ ctx[3]);
    			append_dev(main, t6);
    			append_dev(main, input2);
    			set_input_value(input2, /*beltColor*/ ctx[1]);
    			append_dev(main, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(main, null);
    				}
    			}

    			if (each_1_else) {
    				each_1_else.m(main, null);
    			}

    			append_dev(main, t8);
    			if_block.m(main, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fullName*/ 16) set_data_dev(t0, /*fullName*/ ctx[4]);
    			if (dirty & /*beltColor*/ 2) set_data_dev(t2, /*beltColor*/ ctx[1]);

    			if (dirty & /*firstName*/ 4 && input0.value !== /*firstName*/ ctx[2]) {
    				set_input_value(input0, /*firstName*/ ctx[2]);
    			}

    			if (dirty & /*lastName*/ 8 && input1.value !== /*lastName*/ ctx[3]) {
    				set_input_value(input1, /*lastName*/ ctx[3]);
    			}

    			if (dirty & /*beltColor*/ 2 && input2.value !== /*beltColor*/ ctx[1]) {
    				set_input_value(input2, /*beltColor*/ ctx[1]);
    			}

    			if (dirty & /*friends, deleteHandle*/ 33) {
    				each_value = /*friends*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, destroy_block, create_each_block, t8, get_each_context);

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1(ctx);
    					each_1_else.c();
    					each_1_else.m(main, t8);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (each_1_else) each_1_else.d();
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let fullName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tutorial', slots, []);
    	let name = "Yoshi";
    	let beltColor = "Black";

    	const handleClick = () => {
    		$$invalidate(1, beltColor = "Yellow");
    	};

    	const handleInputChange = e => {
    		$$invalidate(1, beltColor = e.target.value);
    	};

    	let firstName = "Chandler";
    	let lastName = "Bing";
    	let { friends } = $$props;

    	const deleteHandle = id => {
    		console.log("id", id);
    		$$invalidate(0, friends = friends.filter(friend => friend.id !== id));
    	};

    	let num = 25;

    	$$self.$$.on_mount.push(function () {
    		if (friends === undefined && !('friends' in $$props || $$self.$$.bound[$$self.$$.props['friends']])) {
    			console_1$1.warn("<Tutorial> was created without expected prop 'friends'");
    		}
    	});

    	const writable_props = ['friends'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Tutorial> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		firstName = this.value;
    		$$invalidate(2, firstName);
    	}

    	function input1_input_handler() {
    		lastName = this.value;
    		$$invalidate(3, lastName);
    	}

    	function input2_input_handler() {
    		beltColor = this.value;
    		$$invalidate(1, beltColor);
    	}

    	const click_handler = friend => deleteHandle(friend.id);

    	$$self.$$set = $$props => {
    		if ('friends' in $$props) $$invalidate(0, friends = $$props.friends);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		beltColor,
    		handleClick,
    		handleInputChange,
    		firstName,
    		lastName,
    		friends,
    		deleteHandle,
    		num,
    		fullName
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) name = $$props.name;
    		if ('beltColor' in $$props) $$invalidate(1, beltColor = $$props.beltColor);
    		if ('firstName' in $$props) $$invalidate(2, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(3, lastName = $$props.lastName);
    		if ('friends' in $$props) $$invalidate(0, friends = $$props.friends);
    		if ('num' in $$props) $$invalidate(6, num = $$props.num);
    		if ('fullName' in $$props) $$invalidate(4, fullName = $$props.fullName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*firstName, lastName*/ 12) {
    			// Reactive values
    			$$invalidate(4, fullName = `${firstName} ${lastName}`);
    		}

    		if ($$self.$$.dirty & /*beltColor, fullName*/ 18) {
    			// Reactive statements
    			// $: console.log(beltColor);
    			{
    				console.log(beltColor);
    				console.log(fullName);
    			}
    		}
    	};

    	return [
    		friends,
    		beltColor,
    		firstName,
    		lastName,
    		fullName,
    		deleteHandle,
    		num,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		click_handler
    	];
    }

    class Tutorial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { friends: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tutorial",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get friends() {
    		throw new Error("<Tutorial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set friends(value) {
    		throw new Error("<Tutorial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.57.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (47:1) <Modal message="Sign Up Offers" {showModal} on:click={handleToggleModal}>
    function create_default_slot(ctx) {
    	let addpersonform;
    	let current;
    	addpersonform = new AddPersonForm({ $$inline: true });
    	addpersonform.$on("addFriend", /*handleAddFriend*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(addpersonform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addpersonform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addpersonform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addpersonform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addpersonform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(47:1) <Modal message=\\\"Sign Up Offers\\\" {showModal} on:click={handleToggleModal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let button;
    	let t1;
    	let tutorial;
    	let t2;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	tutorial = new Tutorial({
    			props: { friends: /*friends*/ ctx[0] },
    			$$inline: true
    		});

    	modal = new Modal({
    			props: {
    				message: "Sign Up Offers",
    				showModal: /*showModal*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("click", /*handleToggleModal*/ ctx[2]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			button = element("button");
    			button.textContent = "Open Modal";
    			t1 = space();
    			create_component(tutorial.$$.fragment);
    			t2 = space();
    			create_component(modal.$$.fragment);
    			add_location(button, file, 41, 1, 1024);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 39, 0, 1015);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, button);
    			append_dev(main, t1);
    			mount_component(tutorial, main, null);
    			append_dev(main, t2);
    			mount_component(modal, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleToggleModal*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tutorial_changes = {};
    			if (dirty & /*friends*/ 1) tutorial_changes.friends = /*friends*/ ctx[0];
    			tutorial.$set(tutorial_changes);
    			const modal_changes = {};
    			if (dirty & /*showModal*/ 2) modal_changes.showModal = /*showModal*/ ctx[1];

    			if (dirty & /*$$scope*/ 16) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tutorial.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tutorial.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(tutorial);
    			destroy_component(modal);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let friends = [
    		{
    			name: "Joey",
    			beltColor: "red",
    			age: 25,
    			id: 1
    		},
    		{
    			name: "Ross",
    			beltColor: "blue",
    			age: 24,
    			id: 2
    		},
    		{
    			name: "Chandler",
    			beltColor: "black",
    			age: 24,
    			id: 3
    		}
    	];

    	let showModal = false;

    	const handleToggleModal = () => {
    		$$invalidate(1, showModal = !showModal);
    	};

    	/* const handleSubmitForm = (event) => {
    	const formData = new FormData(event.target); // Create a new FormData object from the form
    	console.log("formData", formData)
    	const data = Object.fromEntries(formData.entries()); // Convert the FormData object to a plain JavaScript object
    	console.log(data); // Log the form data to the console
    }; */
    	const handleAddFriend = event => {
    		console.log("event", event.detail);
    		const friend = event.detail;

    		// friends.push(friend) // This does not UPDATE the UI
    		$$invalidate(0, friends = [friend, ...friends]);

    		$$invalidate(1, showModal = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AddPersonForm,
    		Modal,
    		Tutorial,
    		friends,
    		showModal,
    		handleToggleModal,
    		handleAddFriend
    	});

    	$$self.$inject_state = $$props => {
    		if ('friends' in $$props) $$invalidate(0, friends = $$props.friends);
    		if ('showModal' in $$props) $$invalidate(1, showModal = $$props.showModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [friends, showModal, handleToggleModal, handleAddFriend];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
