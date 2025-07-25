import MyIcon from '@/components/Icon';
import { TemplateState } from '@/constants/template';
import { destroyDriver, startDriver, startGuide2 } from '@/hooks/driver';
import { useClientSideValue } from '@/hooks/useClientSideValue';
import { usePathname, useRouter } from '@/i18n';
import { useGuideStore } from '@/stores/guide';
import { useTemplateStore } from '@/stores/template';
import { Box, Button, Center, Flex, Text, useTheme } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function DevboxHeader({ listLength }: { listLength: number }) {
  const { openTemplateModal, config, updateTemplateModalConfig } = useTemplateStore();
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  const lastRoute = '/?openTemplate=publicTemplate';
  useEffect(() => {
    const refreshLastRoute = '/';
    if (config.lastRoute.includes('openTemplate')) {
      openTemplateModal({
        ...config,
        lastRoute: refreshLastRoute
      });
    } else {
      updateTemplateModalConfig({
        ...config,
        lastRoute: refreshLastRoute
      });
    }
  }, []);

  const { guide2, setGuide2 } = useGuideStore();
  const isClientSide = useClientSideValue(true);
  useEffect(() => {
    if (!guide2 && isClientSide) {
      startDriver(
        startGuide2(t, () => {
          router.push('/devbox/create');
        })
      );
    }
  }, [guide2, router, t, isClientSide]);

  return (
    <Flex h={'90px'} alignItems={'center'} flexShrink={0}>
      <Center
        mr={'16px'}
        width={'46px'}
        bg={'#FFF'}
        height={'46px'}
        border={theme.borders.base}
        borderRadius={'md'}
      >
        <MyIcon name="logo" w={'30px'} h={'30px'} />
      </Center>
      <Box fontSize={'xl'} color={'grayModern.900'} fontWeight={'bold'}>
        {t('devbox_list')}
      </Box>
      <Box ml={'8px'} fontSize={'md'} fontWeight={'bold'} color={'grayModern.500'}>
        ( {listLength} )
      </Box>
      <Flex
        alignItems="center"
        justifyContent="center"
        height="18px"
        borderRadius="6px"
        gap="4px"
        mr={'20px'}
        ml={'auto'}
        cursor="pointer"
        onClick={() => {
          // setLastRoute(pathname)
          openTemplateModal({
            templateState: TemplateState.publicTemplate,
            lastRoute
          });
        }}
      >
        <MyIcon
          name={'templateTitle'}
          width="18px"
          height="18px"
          color="brightBlue.600"
          fill={'currentColor'}
        />
        <Text
          fontFamily="PingFang SC"
          fontSize="12px"
          fontWeight="500"
          lineHeight="16px"
          letterSpacing="0.5px"
          color="brightBlue.600"
        >
          {t('scan_templates')}
        </Text>
      </Flex>
      <Button
        mr={'4px'}
        className="list-create-app-button"
        minW={'156px'}
        h={'40px'}
        variant={'solid'}
        leftIcon={<MyIcon name={'plus'} w={'20px'} fill={'#ffffff'} />}
        onClick={() => {
          setGuide2(true);
          destroyDriver();
          router.push('/devbox/create');
        }}
      >
        {t('create_devbox')}
      </Button>
    </Flex>
  );
}
