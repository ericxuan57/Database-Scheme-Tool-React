import { StyleSheet } from '@react-pdf/renderer';

const pdfStyles = StyleSheet.create({
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },

  introPage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 100,
    position: 'relative',
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  introLogo: {
    marginBottom: 100,
  },
  mainPage: {
    paddingTop: 35,
    paddingBottom: 80,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },

  title: {
    textAlign: 'center',
  },

  tocChapter: {
    fontSize: 11,
    color: '#000000',
    textDecoration: 'none',
    lineHeight: 1.5,
  },

  chapterTitle: {
    fontSize: 18,
    borderBottomWidth: 2,
    marginBottom: 20,
    color: '#26215B',
  },
  subChapterTitle: {
    color: '#2AA8DF',
    fontSize: 13,
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
  },

  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'left',
    padding: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 50,
  },
  pageNumber: {
    fontSize: 12,
    color: 'grey',
  },
  footerImage: {
    width: 130,
    marginRight: -10,
  },
});

export default pdfStyles;
