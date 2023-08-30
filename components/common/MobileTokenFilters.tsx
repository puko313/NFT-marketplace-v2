import { Dispatch, FC, SetStateAction } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { Button, Flex, Text } from 'components/primitives'
import Image from 'next/image'
import { FullscreenModal } from 'components/common/FullscreenModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { paths } from '@nftearth/reservoir-sdk'
import { useUserCollections } from '@nftearth/reservoir-kit-ui'
import { NAVBAR_HEIGHT_MOBILE } from 'components/navbar'

type Collections =
  | paths['/users/{user}/collections/v2']['get']['responses']['200']['schema']['collections']
  | ReturnType<typeof useUserCollections>['data']

type Props = {
  collections: Collections
  filterCollection: string | undefined
  setFilterCollection: Dispatch<SetStateAction<string | undefined>>
}

export const MobileTokenFilters: FC<Props> = ({
  collections,
  filterCollection,
  setFilterCollection,
}) => {
  const trigger = (
    <Flex
      justify="center"
      css={{
        position: 'fixed',
        left: 0,
        bottom: '70px',
        width: '100vw',
        zIndex: 99,
      }}
    >
      <Button
        css={{
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
          position: 'fixed',
          px: '$6',
          py: '$3',
        }}
        type="button"
        size="small"
        corners="pill"
        color="gray3"
      >
        <Text style="h6">Filter</Text>
      </Button>
    </Flex>
  )

  if (collections?.length === 0 || collections == null) {
    return null
  }

  return (
    <FullscreenModal trigger={trigger}>
      {' '}
      <Flex
        css={{
          flexDirection: 'column',
          height: '100%',
          overflow: 'scroll',
        }}
      >
        <Flex
          css={{
            py: '$4',
            px: '$4',
            width: '100%',
            borderBottom: '1px solid $gray4',
            height: NAVBAR_HEIGHT_MOBILE,
          }}
          align="center"
          justify="between"
        >
          <Flex align="center">
            <Text style="h5" css={{ mr: '$3' }}>
              Filter
            </Text>
          </Flex>
          <RadixDialog.Close>
            <Flex
              css={{
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: '$gray3',
                color: '$gray12',
                '&:hover': {
                  backgroundColor: '$gray4',
                },
              }}
            >
              <FontAwesomeIcon icon={faXmark} width={16} height={16} />
            </Flex>
          </RadixDialog.Close>
        </Flex>
        <Flex
          direction="column"
          css={{
            pt: '$4',
            maxHeight: `calc(100vh - ${NAVBAR_HEIGHT_MOBILE}px)`,
            overflowY: 'auto',
            pb: '$5',
          }}
        >
          <Text style="subtitle1" css={{ mb: '$2', pl: '$4' }}>
            Collections
          </Text>
          {collections?.map((collection) => {
            let selected = collection?.collection?.id == filterCollection
            return (
              <Flex
                key={collection?.collection?.id}
                css={{
                  py: '$2',
                  px: '$4',
                  gap: '$3',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: selected ? '$gray5' : '$gray4',
                  },
                  backgroundColor: selected ? '$gray5' : '',
                }}
                align="center"
                onClick={() => {
                  if (selected) {
                    setFilterCollection(undefined)
                  } else {
                    setFilterCollection(collection?.collection?.id)
                  }
                }}
              >
                {collection?.collection?.image && (
                  <Image
                    style={{
                      borderRadius: '4px',
                      objectFit: 'cover',
                      aspectRatio: '1/1',
                    }}
                    loader={({ src }) => src}
                    src={collection?.collection?.image as string}
                    alt={collection?.collection?.name as string}
                    width={24}
                    height={24}
                  />
                )}
                <Text
                  style="body1"
                  css={{
                    flex: 1,
                  }}
                  ellipsify
                >
                  {collection?.collection?.name}
                </Text>
                <Text style="subtitle2" css={{ color: '$gray10' }}>
                  {collection?.ownership?.tokenCount}
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </FullscreenModal>
  )
}
