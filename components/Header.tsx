
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { BellIcon, MoonIcon, SunIcon } from './icons';

const Header: React.FC = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const styles = StyleSheet.create({
        header: {
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            zIndex: 50,
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
        },
        logoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },

        controlsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        themeButton: {
            padding: 8,
            borderRadius: 999,
        },
        profileImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        nav: {
            paddingBottom: 12,
        },
        navButton: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        navButtonActive: {
            backgroundColor: colors.primary,
        },
        navText: {
            fontSize: 14,
            fontFamily: 'Inter_500Medium',
            color: colors.text,
        },
        navTextActive: {
            color: '#FFFFFF',
        },
        navContentContainer: {
            gap: 8,
        }
    });



   const logo_pricipal =  require('../assets/images/logo_pricipal.png');
   const logo_branco =  require('../assets/images/logo_branco.png');

   const APPlOGO = isDark ? logo_branco : logo_pricipal;


   //onPress={() => router.push('/(tabs)/news')}

    return (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <View style={styles.logoContainer}>
                    <Image
                        source={APPlOGO}
                        style={{ width: 90, height: 30, marginRight: 8 }}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.controlsContainer}>
                    <TouchableOpacity onPress={() => router.push('/search')} style={styles.themeButton}>
                       <AntDesign name="search1" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                        {isDark ? <SunIcon size={24} color={colors.text} /> : <MoonIcon size={24} color={colors.text} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { /* handle notification */ }}>
                        <BellIcon size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Image source={{ uri: "https://i.pravatar.cc/40" }} style={styles.profileImage} />
                </View>
            </View>
        </View>
    );
};

export default Header;