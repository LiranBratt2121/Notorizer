import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import useFetchSvg from '../hooks/useFetchSvg';
import { TenantProblem } from '@/types/common/Household';

interface RenderProblemsProps {
  problems: TenantProblem[];
}

const RenderProblems: React.FC<RenderProblemsProps> = ({ problems }) => {
  return (
    <View style={styles.problemContainer}>
      {problems.map((problem, index) => {
        const { svgXmlData, loading, error } = useFetchSvg(problem.imageURL);

        if (loading) {
          return (
            <View key={index} style={styles.problemItem}>
              <Text style={styles.problemDescription}>{problem.description}</Text>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          );
        }

        if (error) {
          return (
            <View key={index} style={styles.problemItem}>
              <Text style={styles.problemDescription}>{problem.description}</Text>
              <Text style={styles.errorText}>Failed to load image</Text>
            </View>
          );
        }

        return (
          <View key={index} style={styles.problemItem}>
            <Text style={styles.problemDescription}>{problem.description}</Text>
            {svgXmlData ? (
              <View style={styles.svgContainer}>
                <SvgXml
                  xml={svgXmlData}
                  width="150%"
                  height="100%"
                  style={styles.svgImage}
                />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  problemContainer: {
    marginBottom: 16,
  },
  problemItem: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  problemDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  svgContainer: {
    width: '100%',
    height: 150 * 2.8, // Adjust this height to fit the SVG correctly
    overflow: 'hidden',
    position: 'relative',
  },
  svgImage: {
    position: 'absolute',
    left: '-15%', // Adjust this value to crop more or less from the left
    width: '120%', // Scale to ensure more visibility on the right
    height: '100%',
  },
  errorText: {
    color: 'red',
  },
});

export default RenderProblems;
