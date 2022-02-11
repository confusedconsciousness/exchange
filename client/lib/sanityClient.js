import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: 'beyp6r3z',
    dataset: 'production',
    apiVersion: 'v1',
    token: 'skx9KXxCHbk9hw17PmnFL4DCxh1iHKvTzYdjUGQvVyBXqfWj5pNGUNj6hpWbSrb5TLvhejCtKGP6QIFasGESbvr6eZ9HZbtfNxNP2csh8yfGD1NfZKNouPlglh3tycERuxIAP8vI1fwZNUu2vVjhGbIaOTz1zQemDAHHQAGarCVsmJPUITHM',
    useCdn: false
})