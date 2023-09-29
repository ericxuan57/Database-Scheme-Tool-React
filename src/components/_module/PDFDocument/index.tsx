import React, { Fragment, useRef } from 'react';
import { Page, Text, View, Document, Image, Link } from '@react-pdf/renderer';

import styles from './styles';
import { TDocumentContent, TTOC } from '../../../utils/types';
import introImage from '../../../assets/image/intro.png';

type Props = {
  content?: {
    [key: string]: TDocumentContent[];
  };
  title: string;
  creator: string;
  introPage?: string | null;
  date: string;
  tableOfContent: TTOC;
  setTOC?: React.Dispatch<React.SetStateAction<TTOC>>;
};

const PDFDocument: React.FC<Props> = ({
  content,
  title,
  creator,
  introPage,
  date,
  tableOfContent,
  setTOC = () => {},
}) => {
  const ref = useRef<TTOC>({});

  return content ? (
    <Document title={title} creator={creator} author="Extrico" producer={creator}>
      <Page size="LETTER" style={styles.introPage}>
        <Image style={styles.introLogo} src="/logo.png" />
        <Text style={[styles.title, { fontSize: 28, color: '#26215B' }]}>{title}</Text>
        <Text style={[styles.title, { fontSize: 22, color: '#2AA8DF', marginTop: 30 }]}>{creator}</Text>
        <Text style={[styles.title, { fontSize: 17, color: '#1F3864', marginTop: 30 }]}>{date}</Text>

        <View fixed style={[styles.footer, styles.flexBetween]}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => pageNumber} />
          <Image src="/logo.png" style={styles.footerImage} />
        </View>
      </Page>

      <Page size="LETTER" style={styles.mainPage}>
        <Text style={[styles.subChapterTitle, { fontSize: 16 }]}>Contents</Text>
        {Object.keys(tableOfContent)
          .sort((key1, key2) => tableOfContent[key1].page - tableOfContent[key2].page)
          .map(key => (
            <Fragment key={key}>
              <Link src={`#${key}`} style={[styles.tocChapter, styles.flexBetween, { flexWrap: 'nowrap' }]}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>{key}</Text>
                <Text style={{ flex: 1, overflow: 'hidden' }}>{'.'.repeat(200)}</Text>
                <Text>{tableOfContent[key].page}</Text>
              </Link>
              {Object.keys(tableOfContent[key].children)
                .sort((key1, key2) => tableOfContent[key].children[key1].page - tableOfContent[key].children[key2].page)
                .map(itemKey => {
                  return (
                    <Link
                      src={`#${itemKey}`}
                      key={itemKey}
                      style={[styles.tocChapter, styles.flexBetween, { paddingLeft: 15 }]}
                    >
                      <Text>{itemKey}</Text>
                      <Text style={{ flex: 1, overflow: 'hidden' }}>{'.'.repeat(200)}</Text>
                      <Text>{tableOfContent[key].children[itemKey].page}</Text>
                    </Link>
                  );
                })}
            </Fragment>
          ))}

        <View fixed style={[styles.footer, styles.flexBetween]}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => pageNumber} />
          <Image src="/logo.png" style={styles.footerImage} />
        </View>
      </Page>

      <Page size="LETTER" style={styles.mainPage} bookmark={{ title: 'Introduction' }} wrap={false}>
        <Text style={styles.chapterTitle}>Introduction</Text>
        <View
          render={({ pageNumber }) => {
            ref.current.Introduction = { page: pageNumber, children: {} };
            return null;
          }}
        />
        <Text style={{ fontSize: 11 }}>{introPage}</Text>

        <Text style={[styles.subChapterTitle, { marginTop: 10 }]}>Dataflow Overview</Text>
        <Image style={{ width: '100%', objectFit: 'contain' }} src={introImage} />

        <View fixed style={[styles.footer, styles.flexBetween]}>
          <Text style={styles.pageNumber} render={({ pageNumber }) => pageNumber} />
          <Image src="/logo.png" style={styles.footerImage} />
        </View>
      </Page>

      {Object.keys(content).map(key => (
        <Page size="LETTER" style={styles.mainPage} wrap key={key} bookmark={{ title: key.trim() }}>
          <Text style={styles.chapterTitle} id={key}>
            {key}
          </Text>
          <View
            render={({ pageNumber }) => {
              ref.current[key.trim()] = { page: pageNumber, children: {} };
              return null;
            }}
          />
          {content[key].map((item, itemIndex) => (
            <View key={item.module_ver.module_name} break={itemIndex > 0}>
              <Text style={styles.subChapterTitle} id={(item.module_ver.module_name ?? '').trim()}>
                {(item.module_ver.module_name ?? '').trim()}
              </Text>
              <View
                render={({ pageNumber }) => {
                  ref.current[key].children = {
                    ...ref.current[key].children,
                    [(item.module_ver.module_name ?? '').trim()]: { page: pageNumber, children: {} },
                  };

                  if (
                    Object.keys(ref.current).length === Object.keys(content).length + 1 &&
                    Object.keys(ref.current[key].children).length === content[key].length
                  ) {
                    setTOC(ref.current);
                  }

                  return null;
                }}
              />
              <Text style={styles.text}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Description: </Text>
                {item.module_ver.module_description}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Inclusion: </Text>
                {item.module_ver.module_inclusion}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Exclusion: </Text>
                {item.module_ver.module_exclusion}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Granularity: </Text>
                {item.module_ver.module_granularity}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>IDs:</Text>
                {`Use these IDs to join to other tables – ${item.module_ver.module_identifiers}`}
              </Text>
              <View style={styles.table}>
                <View
                  style={[
                    styles.tableRow,
                    { backgroundColor: '#1F3864', color: '#ffffff', fontFamily: 'Helvetica-Bold' },
                  ]}
                >
                  <View style={[styles.tableCol, { width: '30%' }]}>
                    <Text style={styles.tableCell}>Column Name</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '16%' }]}>
                    <Text style={styles.tableCell}>Type</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '54%' }]}>
                    <Text style={styles.tableCell}>Description</Text>
                  </View>
                </View>
                {item.module_ver.column_module
                  ?.filter(col => col.column_ver)
                  ?.map((col, colIndex) => (
                    <View
                      style={[styles.tableRow, { backgroundColor: colIndex % 2 === 1 ? '#ffffff' : '#d8d8d8' }]}
                      key={col.column_ver?.column_version ?? colIndex}
                    >
                      <View style={[styles.tableCol, { width: '30%' }]}>
                        <Text style={styles.tableCell}>{col.column_ver?.column_name}</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '16%' }]}>
                        <Text style={styles.tableCell}>{col.column_ver?.column_type}</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '54%' }]}>
                        <Text style={styles.tableCell}>{col.column_ver?.column_description}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          ))}

          <View fixed style={[styles.footer, styles.flexBetween]}>
            <Text style={styles.pageNumber} render={({ pageNumber }) => pageNumber} />
            <Image src="/logo.png" style={styles.footerImage} />
          </View>
        </Page>
      ))}
    </Document>
  ) : (
    <Document author="Extrico" pageMode="fullScreen"></Document>
  );
};

export default React.memo(PDFDocument);
