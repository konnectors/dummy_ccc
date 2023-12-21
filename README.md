# [Cozy][cozy] Dummyclisk

## What's this konnector?

This konnector is made to test clisk konnectors without having to have an available website.
And it can set any error message as a result of the execution.

You can also set a website where this konnector will open a page

### How to install ?

This konnector is available in the cozy_ccc registry. You can add

```
 - https://apps-registry.cozycloud.cc/cozy_ccc
```

registry space in your cozy.yaml file and restart your local stack

Then you can install it like any other konnector (but there is no stable release) :

```sh
cozy-stack konnectors install dummyclisk registry://dummyclisk
```

Another solution :

Clone this repository, build it and then install it in your local stack

```sh
git clone git@github.com:konnectors/dummyclisk.git
cd dummyclisk
yarn install
yarn build
cozy-stack konnectors install dummyclisk file://$PWD/build
```
